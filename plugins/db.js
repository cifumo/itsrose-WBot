/* eslint-disable no-unused-vars */
import db from "../lib/database.js";

const handler = async (m, { conn, args, usedPrefix, command }) => {
	const keys = Object.keys(db.data);

	const teks = keys.map((v) => `├ ${v} - ${db.data[v].length || "0"}`).join("\n");
	m.reply(teks);
};
handler.help = ["db"];
handler.tags = ["database"];
handler.command = ["db"];
export default handler;
