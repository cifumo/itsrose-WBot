import { Jammy } from "./jammy.js";
export class Classy extends Jammy {
	constructor() {
		super(...arguments);
		this._items = [];
	}
}
