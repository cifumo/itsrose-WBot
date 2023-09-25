import { Jammy } from "./jammy.js";

export class Classy extends Jammy {
	constructor() {
		super(...arguments);
		this._queue = {};
		this._onProcess = {};
		this.db = this.database;
	}
	name(str) {
		return { name: str };
	}
	description(str) {
		return { description: str };
	}
	parameters(obj) {
		return { parameters: obj };
	}
	force_string(name, obj) {
		return {
			role: "function",
			...this.name(name),
			content: JSON.stringify(obj),
		};
	}
	parse_response(response) {
		return response.choices[0].message;
	}
	error_response(m) {
		const jid = m.sender;
		this._queue[jid].clear = true;
	}
	create_context(m) {
		const jid = m.sender;
		return {
			...this._model(),
			functions: this.indexs,
			function_call: "auto",
			messages: [this._system(), ...this._queue[jid].params.messages],
		};
	}
	should_send_media(opts) {
		if (opts.type === "text") {
			return { type: "text" };
		}
		return opts;
	}
	finish_response(m, response, opts = {}) {
		const options = this.should_send_media(opts);
		const jid = m.sender;
		this._queue[jid].options = {
			[["image", "video"].includes(options.type) ? "caption" : "text"]:
				this.parse_response(response).content,
			...options,
		};
		this._queue[jid].params.last_response = this.parse_response(response);
	}
	clear(m) {
		const jid = m.sender;
		if (jid in this._queue) {
			delete this._queue[jid];
			this._onProcess[jid] = false;
		}
	}
	paramaterize(m) {
		const jid = m.sender;
		if (jid in this._queue) {
			const params = {
				messages: [
					...(this._queue[jid]?.params?.messages ? this._queue[jid].params.messages : []),
				],
			};
			this._queue[jid].params = params;
		}
	}
	prepare(m) {
		const jid = m.sender;
		if (!(jid in this._queue)) {
			this._queue[jid] = {
				params: {
					messages: [],
				},
				options: {},
				clear: false,
			};
		}
	}
	add(m, msg = { params: {} }) {
		const jid = m.sender;
		if (!(jid in this._queue)) {
			this._queue[jid] = msg;
			this.paramaterize(m);
		}
		this._queue[jid].params.messages.push(this._user(m));
		this._onProcess[jid] = true;
	}
	get(m) {
		return this.db[m.sender];
	}
	delete(m) {
		const jid = m.sender;
		if (jid in this._queue) {
			const messages = this._queue[jid].params.messages;
			if (messages.length > 4) {
				messages.splice(0, 2);
			}
			messages.push(this._queue[jid].params.last_response);
		}
		this._onProcess[jid] = false;
	}
	logger(m) {
		const jid = m.sender;
		const number = jid.replace(/[^0-9]/g, "");
		const name = m.name;
		const text = m.text;
		const date = this._date();
		const clock = this._clock();
		const log = `[${date} ${clock}] ${number} ${name}: ${text}`;
		console.log(log);
	}
}
