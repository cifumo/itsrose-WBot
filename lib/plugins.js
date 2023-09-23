import fs from "fs";
import path from "path";
import os from "os";
import syntaxError from "syntax-error";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function loadPlugins() {
	const plugins = {};
	const dir = path.join(__dirname, "..", "plugins");
	for (const file of fs.readdirSync(dir)) {
		const syntax = syntaxError(
			fs.readFileSync(path.join(dir, file), "utf8"),
			file,
			{
				sourceType: "module",
			}
		);
		if (syntax) {
			console.error(`Failed to load plugin ${file}:`, syntax);
			continue;
		}
		const is_win = os.platform() === "win32";
		const pluginFile = is_win
			? `file://${path.join(dir, file)}`
			: path.join(dir, file);
		const { default: plugin } = await import(pluginFile);
		const name = file.replace(/\.js$/, "");
		plugins[name] = plugin;
	}
	console.debug(`Loaded ${Object.keys(plugins).length} plugins`);
	return plugins;
}
