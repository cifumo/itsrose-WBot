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
	if (!is_text) {
		return;
	}
	await rosie.Danil_elist(m, sock);
}
