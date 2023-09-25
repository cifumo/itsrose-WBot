import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import syntaxError from "syntax-error";
import os from "os";
import { Extras } from "./extras.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class Lisa extends Extras {
	constructor() {
		super(...arguments);
		this.plugins = {};
		this.function_loaded = false;
		this.plugins_loaded = false;
		this._watcher = {};
	}
	async call(name, m, opts) {
		if (typeof name !== "string") {
			throw new TypeError("Name must be a string");
		}
		if (!this.functions[name]) {
			throw new TypeError("Function does not exist");
		}
		return this.functions[name](m, opts, this);
	}
	async import(file) {
		const module = await import(`${file}?cacheBust=${Date.now()}`);
		return module.default || module;
	}
	async load_functions() {
		const path_folder = path.join(__dirname, "plugins");
		for (const file of fs.readdirSync(path_folder)) {
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
		console.debug("Functions:", Object.keys(this.functions));
	}
	async watch_functions(_ev, filename) {
		const name = filename.replace(/\.js$/, "");
		const pathFile = path.join(__dirname, "plugins", filename);
		if (name in this.functions) {
			if (fs.existsSync(pathFile)) {
				console.debug(`Plugin ${filename} has been updated`);
			} else {
				delete this.functions[name];
				return console.debug(`Plugin ${filename} has been deleted`);
			}
		}
		const error = syntaxError(fs.readFileSync(pathFile, "utf8"), filename, {
			sourceType: "module",
		});
		if (error) {
			console.error(`Failed to load plugin ${filename}:`, error);
			return;
		}
		const plugin = await this.import(pathFile);
		const _plugin = await plugin();
		this.indexs.push({ ..._plugin.filter((i) => i !== "execute") });
		this.functions[_plugin.name] = _plugin.execute;
		console.debug(`Plugin ${filename} has been loaded`);
		const watch = fs.watch(pathFile, this.watch_functions.bind(this));
		watch.on("close", () => {
			this.delete_plugin_folder(pathFile, true);
		});
		this._watcher[pathFile] = watch;
	}
	async load_plugins() {
		console.debug("Loading plugins...");
		for (const file of fs.readdirSync(this._plugin_folder)) {
			const syntax = syntaxError(
				fs.readFileSync(path.join(this._plugin_folder, file), "utf8"),
				file,
				{
					sourceType: "module",
				}
			);
			if (syntax) {
				console.error(`Failed to load plugin ${file}:`, syntax);
				continue;
			}
			try {
				const is_win = os.platform() === "win32";
				const pluginFile = is_win
					? `file://${path.join(this._plugin_folder, file)}`
					: path.join(this._plugin_folder, file);
				const { default: plugin } = await import(pluginFile);
				plugin.path = pluginFile;
				const name = file.replace(/\.js$/, "");
				this.plugins[name] = plugin;
			} catch (e) {
				console.error(`Failed to load plugin ${file}:`, e);
			}
		}
		this.plugins_loaded = true;
		console.debug("Plugins:", Object.keys(this.plugins));
		const watch = fs.watch(this._plugin_folder, this.watch_plugins.bind(this));
		watch.on("close", () => {
			this.delete_plugin_folder(this._plugin_folder, true);
		});
		this._watcher[this._plugin_folder] = watch;
	}
	async watch_plugins(_ev, filename) {
		const name = filename.replace(/\.js$/, "");
		const is_win = os.platform() === "win32";
		const pathFile = is_win
			? `file://${path.join(this._plugin_folder, filename)}`
			: path.join(this._plugin_folder, filename);
		if (name in this.plugins) {
			if (fs.existsSync(path.join(this._plugin_folder, filename))) {
				console.debug(`Plugin ${filename} has been updated`);
			} else {
				delete this.plugins[name];
				return console.debug(`Plugin ${filename} has been deleted`);
			}
		}
		const error = syntaxError(
			fs.readFileSync(path.join(this._plugin_folder, filename), "utf8"),
			filename,
			{
				sourceType: "module",
			}
		);
		if (error) {
			console.error(`Failed to load plugin ${filename}:`, error);
			return;
		}
		const plugin = await this.import(pathFile).catch((e) => {
			console.error(`Failed to load plugin ${filename}:`, e);
			return { error: e };
		});
		if (plugin.error) {
			return;
		}
		this.plugins[name] = plugin;
		console.debug(`Plugin ${filename} has been loaded`);
	}
	async load_database() {
		this.database = await this._database();
		this.database_loaded = true;
		console.debug("Database Loaded");
	}
}
