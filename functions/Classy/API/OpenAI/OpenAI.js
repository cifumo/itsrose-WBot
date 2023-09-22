import _OpenAI from "openai";

export default class OpenAI {
	constructor() {
		this.openai = new _OpenAI({
			apiKey: process.env.OPENAI_API_KEY,
		});
		this.default_options = {
			model: "gpt-3.5-turbo",
		};
	}
}
