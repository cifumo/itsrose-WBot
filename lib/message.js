import { Rosie } from "../functions/index.js";
import config from "../config.js";

const rosie = new Rosie();
export async function MessageHandler(m, sock) {
	if (m.chat === "status@broadcast" || (!config.allow_group && !m.isOwner)) {
		return;
	}
	if (!rosie.plugin_loaded) {
		await rosie.loadPlugins();
	}
	const is_text = m.text;
	const is_ignored = config.ignore_prefix
		.map((x) => m.text.startsWith(x))
		.includes(true);
	if (!is_text || is_ignored) {
		return;
	}
	await rosie.Danil_elist(m, sock);
}
