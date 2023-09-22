import { jidDecode, downloadContentFromMessage } from "@whiskeysockets/baileys";
import fs from "fs";

export async function downloadMedia(message, pathFile) {
	const type = Object.keys(message)[0];
	const mimeMap = {
		imageMessage: "image",
		videoMessage: "video",
		stickerMessage: "sticker",
		documentMessage: "document",
		audioMessage: "audio",
	};
	try {
		if (pathFile) {
			const stream = await downloadContentFromMessage(message[type], mimeMap[type]);
			let buffer = Buffer.from([]);
			for await (const chunk of stream) {
				buffer = Buffer.concat([buffer, chunk]);
			}
			await fs.promises.writeFile(pathFile, buffer);
			return pathFile;
		} else {
			const stream = await downloadContentFromMessage(message[type], mimeMap[type]);
			let buffer = Buffer.from([]);
			for await (const chunk of stream) {
				buffer = Buffer.concat([buffer, chunk]);
			}
			return buffer;
		}
	} catch (e) {
		Promise.reject(e);
	}
}
export function decodeJid(jid) {
	if (/:\d+@/gi.test(jid)) {
		const decode = jidDecode(jid) || {};
		return (
			(decode.user && decode.server && decode.user + "@" + decode.server) ||
			jid
		).trim();
	} else {
		return jid.trim();
	}
}
