export class Extras {
	constructor() {
		this.function = {};
	}
	_function(name, func) {
		if (typeof name !== "string") {
			throw new TypeError("Name must be a string");
		}
		if (typeof func !== "function") {
			throw new TypeError("Function must be a function");
		}
		this.function[name] = func;
	}
	call(name, ...args) {
		if (typeof name !== "string") {
			throw new TypeError("Name must be a string");
		}
		if (!this.function[name]) {
			throw new TypeError("Function does not exist");
		}
		return this.function[name](...args);
	}
}
