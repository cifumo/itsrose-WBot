import { createClient } from "redis";

export default class Redis {
	constructor(url = "redis://localhost:6379") {
		this.url = url;
		this.client = createClient(this.url);
		this.data = this._data = {};
	}
}
