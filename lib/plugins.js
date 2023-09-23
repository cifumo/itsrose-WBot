import fs from "fs";
import path from "path";
import os from "os";
import syntaxError from "syntax-error";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function load_plugins() {
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
		try {
			const is_win = os.platform() === "win32";
			const pluginFile = is_win
				? `file://${path.join(dir, file)}`
				: path.join(dir, file);
			const { default: plugin } = await import(pluginFile);
			const name = file.replace(/\.js$/, "");
			plugins[name] = plugin;
		} catch (e) {
			console.error(`Failed to load plugin ${file}:`, e);
		}
	}
	return plugins;
}

export async function execute_plugin(m, { conn, plugins, prefix }) {
	for (const name in plugins) {
		const plugin = plugins[name];
		if (!plugin) {
			continue;
		}
		if (typeof plugin.all === "function") {
			try {
				await plugin.all.call(m, {
					conn,
				});
			} catch (e) {
				console.error(e);
			}
		}
		const str2Regex = (str) => str.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
		const _prefix = plugin.customPrefix
			? plugin.customPrefix
			: prefix
			? prefix
			: [".", "#", "/", "!"];
		const match = (
			_prefix instanceof RegExp
				? [[_prefix.exec(m.text), _prefix]]
				: Array.isArray(_prefix)
				? _prefix.map((p) => {
						let re = p instanceof RegExp ? p : new RegExp(str2Regex(p));
						return [re.exec(m.text), re];
						// eslint-disable-next-line no-mixed-spaces-and-tabs
				  })
				: typeof _prefix === "string"
				? [
						[new RegExp(str2Regex(_prefix)).exec(m.text), new RegExp(str2Regex(_prefix))],
						// eslint-disable-next-line no-mixed-spaces-and-tabs
				  ]
				: [[[], new RegExp()]]
		).find((p) => p[1]);
		if (typeof plugin.before === "function") {
			if (
				await plugin.before.call(this, m, {
					match,
					conn,
				})
			) {
				continue;
			}
		}
		if (typeof plugin.after === "function") {
			if (
				await plugin.after.call(this, m, {
					match,
					conn,
				})
			) {
				continue;
			}
		}
		if (typeof plugin !== "function") {
			continue;
		}
		let usedPrefix;
		if ((usedPrefix = (match[0] || "")[0])) {
			const noPrefix = m.text.replace(usedPrefix, "");
			let [command, ...args] = noPrefix
				.trim()
				.split(" ")
				.filter((v) => v);
			args = args || [];
			const _args = noPrefix.trim().split(" ").slice(1);
			const text = _args.join(" ");
			command = (command || "").toLowerCase();
			const isAccept =
				plugin.command instanceof RegExp
					? plugin.command.test(command)
					: Array.isArray(plugin.command)
					? plugin.command.some(
							(cmd) => (cmd instanceof RegExp ? cmd.test(command) : cmd === command)
							// eslint-disable-next-line no-mixed-spaces-and-tabs
					  )
					: typeof plugin.command === "string"
					? plugin.command === command
					: false;

			if (!isAccept) {
				continue;
			}
			const extra = {
				match,
				usedPrefix,
				args,
				command,
				text,
				conn,
			};
			try {
				await plugin.call(m, extra);
			} catch (e) {
				console.error(e);
			} finally {
				if (typeof plugin.after === "function") {
					try {
						await plugin.after.call(m, extra);
					} catch (e) {
						console.error(e);
					}
				}
			}
			break;
		}
	}
}
