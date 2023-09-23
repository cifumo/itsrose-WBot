/* eslint-disable no-unused-vars */
/**
 * Template for building.
 */
import { performance } from "perf_hooks";
import os from "os";

import config from "../config.js";

export default async function (m, conn) {
	const isCommand = m.text.startsWith(config.prefix);
	const isOwner = config.owner
		.map((v) => v + "@s.whatsapp.net")
		.includes(m.sender);
	const command = m.text
		.slice(config.prefix.length)
		.trim()
		.split(/ +/)
		.shift()
		.toLowerCase();
	console.debug({
		isCommand,
		isOwner,
		command,
	});
	const args = m.text.slice(config.prefix.length).trim().split(/ +/).slice(1);
	const text = args.join(" ");

	switch (command) {
		case "ping": {
			const old = performance.now();
			const ram = (os.totalmem() / Math.pow(1024, 3)).toFixed(2) + " GB";
			const free_ram = (os.freemem() / Math.pow(1024, 3)).toFixed(2) + " GB";
			let teks = "```Server Information\n\n";
			teks += `- ${os.cpus().length} CPU: ${os.cpus()[0].model}\n`;
			teks += `- Uptime: ${Math.floor(os.uptime() / 86400)} days\n`;
			teks += `- Ram: ${free_ram}/${ram}\n`;
			teks += `- Speed: ${(performance.now() - old).toFixed(5)} ms\`\`\``;
			m.reply(teks);
			break;
		}
		default: {
			break;
		}
	}
}
