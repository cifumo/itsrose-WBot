const handler = async (m, { usedPrefix, plugins }) => {
	const plugin = Object.entries(plugins);
	const tags = [...new Set(plugin.map((v) => v[1].tags).flat())];
	let teks = `*「 MENU 」*\n\n*Prefix*: ${usedPrefix}\n*Total Plugins*: ${plugin.length}\n*Total Tags*: ${tags.length}\n\n`;
	for (let i = 0; i < tags.length; i++) {
		teks += `*${tags[i]}*\n`;
		for (let j = 0; j < plugin.length; j++) {
			if (plugin[j][1].tags.includes(tags[i])) {
				teks += `├ ${usedPrefix}${plugin[j][1].help[0]}\n`;
			}
		}
		teks += "\n";
	}
	m.reply(teks.trim());
};

handler.command = ["menu", "help", "start"];
handler.tags = ["main"];
handler.help = ["menu", "help", "start"];

export default handler;
