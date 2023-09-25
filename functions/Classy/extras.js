import { Classy } from "./classy.js";

export class Extras extends Classy {
	constructor() {
		super(...arguments);
		this.functions = {};
		this.indexs = [];
	}
	delete_plugin_folder(folder, isAlreadyClosed = false) {
		const resolved = path.resolve(folder);
		if (!(resolved in this._watcher)) {
			return;
		}
		if (!isAlreadyClosed) {
			this._plugin_folder._watcher[resolved].close();
		}
		delete this._watcher[resolved];
		this._plugin_folder.splice(this._plugin_folder.indexOf(resolved), 1);
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
}
