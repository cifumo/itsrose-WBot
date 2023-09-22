import mongoose from "mongoose";
import URI from "./ConnectionURI.js";
const { Schema, connect, model: _model } = mongoose;

export default class MongoDB {
	constructor(
		url = URI,
		options = { useNewUrlParser: true, useUnifiedTopology: true }
	) {
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
