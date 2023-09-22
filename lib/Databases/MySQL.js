import { createConnection } from "mysql2/promise";

export default class MySQL {
	constructor(url = "mysql://localhost:3306", options = {}) {
		this.url = url;
		this.options = options;
		this.data = this._data = {};
		this._schema = {};
		this._model = {};
		this.db = createConnection(this.url, { ...this.options }).catch(console.error);
	}
}
