import { Jammy } from "./jammy.js";
export class Classy extends Jammy {
	constructor() {
		super(...arguments);
		this._items = [];
	}
	add(item) {
		this._items.push(item);
	}
	getItems() {
		return this._items;
	}
	find(callback) {
		return this._items.find(callback);
	}
	remove(item) {
		const index = this._items.indexOf(item);
		if (index > -1) {
			this._items.splice(index, 1);
		}
	}
	filter(callback) {
		return this._items.filter(callback);
	}
}
