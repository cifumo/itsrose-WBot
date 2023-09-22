export class Read {
	async read() {
		return new Promise((resolve, reject) => {
			this.conn = this.db;
			this._data = this._model.find((err, data) => {
				if (err) reject(err);
				else resolve(data);
			});
		});
	}
}
export class Write {
	write(data) {
		return new Promise((resolve, reject) => {
			this.conn = this.db;
			this._data = new this._model({ data });
			this._data.save((err, data) => {
				if (err) reject(err);
				else resolve(data);
			});
		});
	}
}
export class Database extends Read {
	constructor(
		url = URI,
		options = { useNewUrlParser: true, useUnifiedTopology: true }
	) {
		super();
		this.Schema = Schema;
		this.Model = _model;
		this.url = url;
		this.options = options;
		this.data = this._data = {};
		this._schema = {};
		this._model = {};
		this.db = connect(this.url, { ...this.options }).catch(console.error);
	}
}
export class MongoDB extends Database {
	constructor(
		url = URI,
		options = { useNewUrlParser: true, useUnifiedTopology: true }
	) {
		super(url, options);
	}
}
export class MySQL extends Database {
	constructor(
		url = URI,
		options = { useNewUrlParser: true, useUnifiedTopology: true }
	) {
		super(url, options);
	}
}
export class PostgreSQL extends Database {
	constructor(
		url = URI,
		options = { useNewUrlParser: true, useUnifiedTopology: true }
	) {
		super(url, options);
	}
}
export class SQLite extends Database {
	constructor(
		url = URI,
		options = { useNewUrlParser: true, useUnifiedTopology: true }
	) {
		super(url, options);
	}
}
export class MariaDB extends Database {
	constructor(
		url = URI,
		options = { useNewUrlParser: true, useUnifiedTopology: true }
	) {
		super(url, options);
	}
}
export class OracleDB extends Database {
	constructor(
		url = URI,
		options = { useNewUrlParser: true, useUnifiedTopology: true }
	) {
		super(url, options);
	}
}
