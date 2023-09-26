import axios from "axios";

class OpenAI {
	constructor() {
		this.OPEN_AI_URL = "https://api.openai.com";
	}
	async openai_api(options = {}) {
		const { data } = await axios
			.request({
				baseURL: this.OPEN_AI_URL,
				url: "/v1/chat/completions",
				method: "POST",
				data: {
					...options,
				},
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
				},
			})
			.catch((e) => e?.response);
		if (data.error) {
			return {
				error: data.error,
			};
		}
		return data;
	}
}
class ItsRose extends OpenAI {
	constructor() {
		super(...arguments);
		this.ITSROSE_URL = "https://api.itsrose.life";
	}
	async itsrose_api(options = {}) {
		const { data } = await axios
			.request({
				baseURL: this.ITSROSE_URL,
				url: "/chatGPT/turbo",
				method: "POST",
				data: {
					...options,
				},
				params: {
					apikey: process.env.ITSROSE_API_KEY,
				},
				headers: {
					"Content-Type": "application/json",
					apikey: process.env.ITSROSE_API_KEY,
				},
			})
			.catch((e) => e?.response);
		const { status, result, message } = data;
		if (!status) {
			return { error: message };
		}
		return result.default_response;
	}
	static async request(options = {}) {
		const instance = axios.create({
			baseURL: "https://api.itsrose.life",
			headers: {
				apikey: process.env.ITSROSE_API_KEY,
			},
		});
		instance.interceptors.request.use((config) => {
			config.params = {
				apikey: process.env.ITSROSE_API_KEY,
				...config.params,
			};
			return config;
		});
		return await instance.request(options).catch((e) => e?.response);
	}
}

export class Api extends ItsRose {
	constructor() {
		super(...arguments);
		this.use_openaiAPI = false;
	}
	async create_request(options) {
		if (typeof options !== "object") {
			throw new TypeError("Options must be an object");
		}
		const openai_APIKEY = process.env.OPENAI_API_KEY;
		if (!openai_APIKEY) {
			this.use_openaiAPI = false;
		}
		if (this.use_openaiAPI) {
			return this.openai_api(options);
		}
		return this.itsrose_api(options);
	}
}
