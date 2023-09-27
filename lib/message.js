import { Rosie } from "../functions/index.js";
import config from "../config.js";
import { pluginFolders } from "./plugins.js";
import { load_database } from "./database.js";
import caseHandler from "../case/index.js";

export const rosie = new Rosie(load_database, pluginFolders);

export async function MessageHandler(m, sock) {
	if (m.chat === "status@broadcast" || m.fromMe) {
		return;
	}
	const isOwner = config.owner
		.map((v) => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net")
		.includes(m.sender);

	if (m.isGroup && !config.allow_group && !isOwner) {
		return;
	}
	const prefix = config.prefix;
	if (config.openAI.enabled && !m.text.startsWith(prefix)) {
		await rosie.ai(m, sock);
	}
	if (config.use_case) {
		try {
			await caseHandler(m, sock);
		} catch (e) {
			console.error(e);
		}
	}
	for (const name in rosie.plugins) {
		const plugin = rosie.plugins[name];
		if (!plugin) {
			continue;
		}
		if (typeof plugin.all === "function") {
			try {
				await plugin.all.call(m, {
					conn: sock,
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
					conn: sock,
				})
			) {
				continue;
			}
		}
		if (typeof plugin.after === "function") {
			if (
				await plugin.after.call(this, m, {
					match,
					conn: sock,
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
				conn: sock,
				plugins: rosie.plugins,
			};
			try {
				await plugin.call(this, m, { ...extra });
			} catch (e) {
				console.error(e);
			} finally {
				if (typeof plugin.after === "function") {
					try {
						await plugin.after.call(this, m, extra);
					} catch (e) {
						console.error(e);
					}
				}
			}
			break;
		}
	}
	rosie.logger(m);
}
