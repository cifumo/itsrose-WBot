import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Extras } from "./Extras.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class Lisa extends Extras {
	constructor() {
		super(...arguments);
		this.function_loaded = false;
		this.plugins_loaded = false;
	}
	async load_functions() {
		for (const file of fs.readdirSync(path.join(__dirname, "plugins"))) {
			try {
				const { default: plugin } = await import(`./plugins/${file}`);
				const _plugin = await plugin();
				this.indexs.push({ ..._plugin });
				this.functions[_plugin.name] = _plugin.execute;
			} catch (e) {
				console.error(`Failed to load plugin ${file}:`, e);
			}
		}
		this.function_loaded = true;
	}
	async load_plugins() {
		this.plugins = await this._plugins();
		this.plugins_loaded = true;
		console.debug("Plugins:", Object.keys(this.plugins));
	}
	async load_database() {
		this.database = await this._database();
		this.database_loaded = true;
		console.debug("Database Loaded");
	}
}
