import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Extras } from "./Extras.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class Lisa extends Extras {
	constructor() {
		super(...arguments);
		this.plugin_loaded = false;
	}
	async loadPlugins() {
		for (const file of fs.readdirSync(path.join(__dirname, "plugins"))) {
			const { default: plugin } = await import(`./plugins/${file}`);
			const _plugin = await plugin();
			this.indexs.push({ ..._plugin });
			this.functions[_plugin.name] = _plugin.execute;
		}
		this.plugin_loaded = true;
	}
}
