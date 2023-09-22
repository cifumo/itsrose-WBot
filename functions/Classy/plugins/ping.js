import os from "os";

export default function ping() {
	return {
		name: "ping",
		description: "Get the bot's ping",
		parameters: {
			type: "object",
			properties: {
				ping: {
					type: "string",
					description: "The bot's ping",
				},
				cpu_number: {
					type: "number",
					description: "The number of CPU cores",
				},
				cpu_model: {
					type: "string",
					description: "The CPU model",
				},
				uptime: {
					type: "string",
					description: "The bot's uptime",
				},
				ram: {
					type: "string",
					description: "The bot's RAM",
				},
				free_ram: {
					type: "string",
					description: "The bot's free RAM",
				},
			},
		},
		execute: function () {
			const old_time = performance.now();
			const ram = (os.totalmem() / Math.pow(1024, 3)).toFixed(2) + " GB";
			const free_ram = (os.freemem() / Math.pow(1024, 3)).toFixed(2) + " GB";
			return {
				type: "text",
				response: {
					content: "Pong!",
					message: "Success 🎉",
					cpu_number: os.cpus().length,
					cpu_model: os.cpus()[0].model,
					uptime: `${Math.floor(os.uptime() / 86400)} days`,
					ram,
					free_ram,
					ping: (performance.now() - old_time).toFixed(2) + " ms",
				},
			};
		},
	};
}
