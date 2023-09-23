import { Lisa } from "./lisa.js";

export class Rosie extends Lisa {
	constructor() {
		super(...arguments);
	}
	async create_request(options) {
		return await this.openai.chat.completions
			.create({
				...options,
			})
			.catch((e) => ({ error: true, ...e }));
	}
	async call_plugin(m, context, contexts) {
		const { name, arguments: args } = contexts.function_call;
		let opts;
		try {
			opts = JSON.parse(args);
		} catch {
			opts = {};
		}
		const _response = await this.call(name, m, opts).catch((e) => ({
			error: e,
		}));
		if (_response.error) {
			console.error(`Failed to call plugin ${name}:`, _response);
			return this.error_response(m);
		}
		const additional = this.force_string(name, _response.response);
		context.messages.push(additional);
		const response = await this.create_request(context);
		console.debug("Response:", response);
		if (response.error) {
			return this.error_response(m);
		}
		this.finish_response(m, response, _response);
	}
	async process(m) {
		const jid = m.sender;
		if (jid in this._queue) {
			const context = this.create_context(m);
			const response = await this.create_request(context);
			console.debug("Response:", response);
			if (response.error) {
				return this.error_response(m);
			}
			const contexts = this.parse_response(response);
			if (contexts.function_call) {
				return this.call_plugin(m, context, contexts);
			}
			this.finish_response(m, response, { type: "text" });
		}
	}
	async Danil_elist(m, sock) {
		if (this._onProcess[m.sender]) {
			return;
		}
		this.add(m);
		const jid = m.sender;
		if (!(jid in this._queue)) {
			return;
		}
		console.debug("Processing message from:", jid);
		await this.process(m);
		if (this._queue[jid].clear) {
			console.debug("Clearing message from:", jid);
			this.clear(m);
		} else {
			console.debug("Sending message to", jid);
			console.debug("Message", this._queue[jid].options);
			await sock
				.sendMessage(
					m.isGroup ? m.chat : jid,
					{ ...this._queue[jid].options },
					{ quoted: m }
				)
				.catch(console.error);
			this.delete(m);
		}
	}
}
