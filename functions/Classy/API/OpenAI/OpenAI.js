import _OpenAI from "openai";
import { Extras } from "./Extras.js";

export default class OpenAI extends Extras {
	constructor(key) {
		super(...arguments);
		this.key = key;
		this.openai = new _OpenAI(key);
		this.default_options = {
			model: "gpt-3.5-turbo",
		};
	}
}
