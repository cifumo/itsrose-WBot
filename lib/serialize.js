import { getContentType } from "@whiskeysockets/baileys";
import { decodeJid, downloadMedia } from "./utils.js";

export default function serialize(m, sock) {
	if (m.key) {
		m.id = m.key.id;
		m.fromMe = m.key.fromMe;
		m.isGroup = m.key?.remoteJid.endsWith("@g.us");
		m.chat = decodeJid(
			m.key?.remoteJid ||
				(m.key?.remoteJid && m.key?.remoteJid !== "status@broadcast") ||
				""
		);
		m.sender = decodeJid(
			(m.key?.fromMe && m.conn?.user.id) ||
				m.participant ||
				m.key.participant ||
				m.chat ||
				""
		);
	}
	if (m.message) {
		m.type = getContentType(m.message);
		if (m.type === "ephemeralMessage") {
			m.message = m.message[m.type].message;
			const tipe = Object.keys(m.message)[0];
			m.type = tipe;
			if (tipe === "viewOnceMessage") {
				m.message = m.message[m.type].message;
				m.type = getContentType(m.message);
			}
		}
		if (m.type === "viewOnceMessage") {
			m.message = m.message[m.type].message;
			m.type = getContentType(m.message);
		}
		m.mtype = Object.keys(m.message).filter(
			(v) => v.includes("Message") || v.includes("conversation")
		)[0];

		m.mentions = m.message[m.type]?.contextInfo
			? m.message[m.type]?.contextInfo.mentionedJid
			: null;
		try {
			const quoted = m.message[m.type]?.contextInfo;
			if (quoted.quotedMessage["ephemeralMessage"]) {
				const tipe = Object.keys(quoted.quotedMessage.ephemeralMessage.message)[0];
				if (tipe === "viewOnceMessage") {
					m.quoted = {
						type: "view_once",
						stanzaId: quoted.stanzaId,
						participant: decodeJid(quoted.participant),
						message: quoted.quotedMessage.ephemeralMessage.message.viewOnceMessage.message,
					};
				} else {
					m.quoted = {
						type: "ephemeral",
						stanzaId: quoted.stanzaId,
						participant: decodeJid(quoted.participant),
						message: quoted.quotedMessage.ephemeralMessage.message,
					};
				}
			} else if (quoted.quotedMessage["viewOnceMessage"]) {
				m.quoted = {
					type: "view_once",
					stanzaId: quoted.stanzaId,
					participant: decodeJid(quoted.participant),
					message: quoted.quotedMessage.viewOnceMessage.message,
				};
			} else {
				m.quoted = {
					type: "normal",
					stanzaId: quoted.stanzaId,
					participant: decodeJid(quoted.participant),
					message: quoted.quotedMessage,
				};
			}
			m.quoted.fromMe = m.quoted.participant === decodeJid(sock.user.id);
			m.quoted.mtype = Object.keys(m.quoted.message).filter(
				(v) => v.includes("Message") || v.includes("conversation")
			)[0];
			m.quoted.text =
				m.quoted.message[m.quoted.mtype]?.text ||
				m.quoted.message[m.quoted.mtype]?.description ||
				m.quoted.message[m.quoted.mtype]?.caption ||
				m.quoted.message[m.quoted.mtype]?.hydratedTemplate?.hydratedContentText ||
				m.quoted.message[m.quoted.mtype]?.editedMessage?.extendedTextMessage?.text ||
				m.quoted.message[m.quoted.mtype] ||
				"";
			m.quoted.key = {
				id: m.quoted.stanzaId,
				fromMe: m.quoted.fromMe,
				remoteJid: m.chat,
			};
			m.quoted.delete = () => sock.sendMessage(m.chat, { delete: m.quoted.key });
			m.quoted.download = (pathFile) => downloadMedia(m.quoted.message, pathFile);
			m.quoted.react = (text) =>
				sock.sendMessage(m.chat, { react: { text, key: m.quoted.key } });
		} catch {
			m.quoted = null;
		}
		m.body =
			m.message?.conversation ||
			m.message?.[m.type]?.text ||
			m.message?.[m.type]?.caption ||
			m.message?.[m.type]?.editedMessage?.extendedTextMessage?.text ||
			(m.type === "listResponseMessage" &&
				m.message?.[m.type]?.singleSelectReply?.selectedRowId) ||
			(m.type === "buttonsResponseMessage" &&
				m.message?.[m.type]?.selectedButtonId) ||
			(m.type === "templateButtonReplyMessage" && m.message?.[m.type]?.selectedId) ||
			"";
		m.text = m.body;
		m.name = m?.pushName;
		m.reply = (text) => sock.sendMessage(m.chat, { text }, { quoted: m });
		m.download = (pathFile) => downloadMedia(m.message, pathFile);
		m.react = (text) => sock.sendMessage(m.chat, { react: { text, key: m.key } });
	}
	return m;
}
