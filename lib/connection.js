import {
	makeWASocket,
	DisconnectReason,
	fetchLatestBaileysVersion,
	makeInMemoryStore,
	useMultiFileAuthState,
	// getAggregateVotesInPollMessage,
} from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import pino from "pino";
import { fileURLToPath } from "url";
// import otp from "./otp.js";
import serialize from "./serialize.js";
import config from "../config.js";

const logger = pino({ level: "info", stream: "store" });
const store = makeInMemoryStore({ logger });

store?.readFromFile("./baileys_store_multi.json");
// save every 10s
setInterval(() => {
	store?.writeToFile("./baileys_store_multi.json");
}, 10_000);

export default async function startsocks(MessageHandler) {
	const { state, saveCreds } = await useMultiFileAuthState(
		fileURLToPath(new URL("../sessions", import.meta.url))
	);
	const { version } = await fetchLatestBaileysVersion();
	const sock = makeWASocket({
		printQRInTerminal: true,
		generateHighQualityLinkPreview: true,
		syncFullHistory: true,
		auth: {
			...state,
		},
		logger,
		version,
	});
	store?.bind(sock.ev);
	if (config.use_otp) {
		// await otp(sock);
	}
	sock.ev.process(async (events) => {
		// handle events here
		// connection update
		if (events["connection.update"]) {
			const update = events["connection.update"];
			const { connection, lastDisconnect } = update;
			const reason = new Boom(lastDisconnect?.error)?.output.statusCode;
			if (connection == "close") {
				if (reason !== DisconnectReason.loggedOut) {
					startsocks();
				} else {
					// close the process
					console.log("Logged out");
					process.exit(0);
				}
			}
			if (connection == "open") {
				console.log("Connected");
			}
		}

		// credentials updated
		if (events["creds.update"]) {
			await saveCreds();
		}

		// reject incoming calls
		if (events["call"]) {
			const m = events["call"][0];
			if (m.status == "offer") {
				sock.rejectCall(m.id, m.from);
			}
		}

		// new messages
		if (events["messages.upsert"]) {
			const m = events["messages.upsert"];
			if (m.type == "notify") {
				const messages = serialize(m?.["messages"]?.[0], sock);
				if (typeof MessageHandler === "function") {
					MessageHandler(messages, sock);
				}
			}
		}

		// Dont need

		// chats updated
		// if (events["chats.update"]) {
		// 	console.log(events["chats.update"]);
		// }

		// // chats deleted
		// if (events["chats.delete"]) {
		// 	console.log("chats deleted ", events["chats.delete"]);
		// }

		// if (events["messages.update"]) {
		// 	console.log(JSON.stringify(events["messages.update"], undefined, 2));

		// 	for (const { key, update } of events["messages.update"]) {
		// 		if (update.pollUpdates) {
		// 			const pollCreation = await getMessage(key);
		// 			if (pollCreation) {
		// 				console.log(
		// 					"got poll update, aggregation: ",
		// 					getAggregateVotesInPollMessage({
		// 						message: pollCreation,
		// 						pollUpdates: update.pollUpdates,
		// 					})
		// 				);
		// 			}
		// 		}
		// 	}
		// }
	});
}
