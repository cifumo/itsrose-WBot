import { Classy } from "./classy.js";

export class Extras extends Classy {
	constructor() {
		super(...arguments);
		this.functions = {};
		this.indexs = [];
	}
	_function(name, func) {
		if (typeof name !== "string") {
			throw new TypeError("Name must be a string");
		}
		if (typeof func !== "function") {
			throw new TypeError("Function must be a function");
		}
		this.functions[name] = func;
	}
	async call(name, m, opts) {
		if (typeof name !== "string") {
			throw new TypeError("Name must be a string");
		}
		if (!this.functions[name]) {
			throw new TypeError("Function does not exist");
		}
		return this.functions[name](m, opts);
	}
}
