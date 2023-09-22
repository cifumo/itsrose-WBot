import OpenAI from "./OpenAI.js";

export default class API extends OpenAI {
	constructor(key) {
		super(key);
	}
	async chat(messages, options = {}) {
		if (typeof messages !== "object" || !Array.isArray(messages)) {
			throw new TypeError("Messages must be an array");
		}
		return await this.openai.chat.completions.create({
			messages,
			...options,
			...this.default_options,
		});
	}
	async complete(prompt, options = {}) {
		return await this.openai.complete({
			prompt,
			...options,
		});
	}
	async search(documents, query, options = {}) {
		return await this.openai.search({
			documents,
			query,
			...options,
		});
	}
	async classify(documents, query, options = {}) {
		return await this.openai.classify({
			documents,
			query,
			...options,
		});
	}
	async answers(documents, question, options = {}) {
		return await this.openai.answers({
			documents,
			question,
			...options,
		});
	}
	async engine(engine, prompt, options = {}) {
		return await this.openai.engine(engine, {
			prompt,
			...options,
		});
	}
	async engines() {
		return await this.openai.engines();
	}
	async completions(engine, prompt, options = {}) {
		return await this.openai.completions(engine, {
			prompt,
			...options,
		});
	}
	async files() {
		return await this.openai.files();
	}
	async file(id) {
		return await this.openai.file(id);
	}
	async deleteFile(id) {
		return await this.openai.deleteFile(id);
	}
	async createFile(file) {
		return await this.openai.createFile(file);
	}
	async searchFiles(query) {
		return await this.openai.searchFiles(query);
	}
	async retrieveAnswer(id) {
		return await this.openai.retrieveAnswer(id);
	}
	async retrieveFile(id) {
		return await this.openai.retrieveFile(id);
	}
}
