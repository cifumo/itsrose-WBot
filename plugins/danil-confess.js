const handler = async (m, { conn, text, usedPrefix, command }) => {
	const [number, reason] = text.split("|");
	if (!number || !reason) {
		return m.reply(`Example: *${usedPrefix + command}* 6281234567890|Reason`);
	}
	const [isOnWhatsapp = { exists: false }] = await conn.onWhatsApp(number);
	if (!isOnWhatsapp.exists) {
		return m.reply("The number is not registered on WhatsApp");
	}
	await conn.sendMessage(number.replace(/[^0-9]/g, "") + "@s.whatsapp.net", {
		text: `Hi, someone confesses to you\n\n${reason}\n\nIf you want to confess, please send a message to the bot\n\n${usedPrefix}confess <number>|<reason>`,
	});
	m.reply("Confess sent!");
};
handler.help = ["confess <number>|<reason>"];
handler.tags = ["fun"];
handler.command = ["confess"];
export default handler;
