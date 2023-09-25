import uploader from "../lib/uploader.js";

const handler = async (m, { usedPrefix, command }) => {
	const q = m.quoted ? m.quoted : m;
	const mime = q.mtype || "";
	if (!/image/.test(mime)) {
		return m.reply(`reply or send image with caption *${usedPrefix + command}*`);
	}

	m.reply("Please wait...");

	const buffer = await q.download();
	const [telegraph, imgbb, imgur] = await Promise.all([
		uploader.telegraph(buffer).catch(() => "Error telegra.ph"),
		uploader.imgbb(buffer).catch(() => "Error imgbb.com"),
		uploader.imgur(buffer).catch(() => "Error imgur.com"),
	]);
	m.reply(
		`
*Telegraph:* ${telegraph}
*ImgBB:* ${imgbb}
*Imgur:* ${imgur}
`.trim()
	);
};

handler.help = ["tourl"];
handler.tags = ["tools"];
handler.command = ["tourl"];
export default handler;
