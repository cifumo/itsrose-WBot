import { Rosie } from "../functions/index.js";
import config from "../config.js";
import { load_plugins, execute_plugin } from "./plugins.js";
import { load_database } from "./database.js";
import caseHandler from "../case/index.js";

export const rosie = new Rosie(load_plugins, load_database);

export async function MessageHandler(m, sock) {
	if (m.chat === "status@broadcast" || m.fromMe) {
		return;
	}
	if (config.openAI.enabled) {
		await rosie.ai(m, sock);
	}
	if (config.use_plugins) {
		await execute_plugin(m, {
			prefix: config.prefix,
			conn: sock,
			plugins: rosie.plugins,
		});
	}
	if (config.use_case) {
		await caseHandler(m, sock);
	}
}
