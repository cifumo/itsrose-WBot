import { performance } from "perf_hooks";
import os from "os";

const handler = async (m) => {
	const old = performance.now();
	const ram = (os.totalmem() / Math.pow(1024, 3)).toFixed(2) + " GB";
	const free_ram = (os.freemem() / Math.pow(1024, 3)).toFixed(2) + " GB";
	m.reply(`\`\`\`Server Information

- ${os.cpus().length} CPU: ${os.cpus()[0].model}

- Uptime: ${Math.floor(os.uptime() / 86400)} days
- Ram: ${free_ram}/${ram}
- Speed: ${(performance.now() - old).toFixed(5)} ms\`\`\``);
};

handler.help = ["ping", "speed"];
handler.tags = ["info", "tools"];

handler.command = /^(ping|speed)$/i;
export default handler;
