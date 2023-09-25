import itsrose from "../lib/itsrose.life.js";

const handler = async (m, { usedPrefix, command, text: prompt }) => {
	if (!prompt || prompt.length < 2) {
		return m.reply(`Example: *${usedPrefix + command}* Define love in simple way.`);
	}
	const { message } = await itsrose.request({
		url: "/chatGPT/completions",
		method: "POST",
		data: {
			prompt,
		},
	});
	m.reply(message);
};

handler.help = ["chatgpt <text>"];
handler.tags = ["fun"];
handler.command = ["chatgpt"];
export default handler;
