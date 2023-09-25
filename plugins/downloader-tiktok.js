import itsrose from "../lib/itsrose.life.js";

const handler = async (m, { conn, usedPrefix, command, args }) => {
	const [url] = args;
	if (!url) {
		return m.reply(`Example: *${usedPrefix + command}* tiktok_link`);
	}

	m.reply("Please wait...");

	const { status, message, desc, author, download } = await itsrose.request({
		url: "/downloader/tiktok",
		method: "GET",
		params: {
			url,
		},
	});
	if (!status) {
		return m.reply(message);
	}
	const { nickname } = author;
	const { nowm } = download;
	const caption = `*Author*: ${nickname}\n${desc}`;
	const is_audio = nowm.endsWith(".mp3");
	await conn.sendMessage(
		m.chat,
		{
			[is_audio ? "audio" : "video"]: {
				url: nowm,
			},
			...(is_audio ? { mimetype: "audio/mp4" } : { caption }),
		},
		{ quoted: m }
	);
};

handler.help = ["tiktok"];
handler.tags = ["downloader"];
handler.command = ["tiktok"];
export default handler;
