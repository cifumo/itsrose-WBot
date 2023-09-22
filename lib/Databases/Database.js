import MongoDB from "./MongoDB.js";

export default class Database extends MongoDB {
	async list_collections() {
		return await this.db.then((db) => db);
	}
	async read() {
		this.conn = await this.db;
		const schema = (this._schema = new this.Schema({
			data: {
				type: Object,
				required: true,
				default: {},
			},
		}));
		try {
			this._model = this.Model("data", schema);
		} catch {
			this._model = this.Model("data");
		}
		this._data = await this._model.findOne({});
		if (!this._data) {
			this.data = {};
			await this.write(this.data);
			this._data = await this._model.findOne({});
		} else this.data = this._data.data;
		return this.data;
	}

	async write(data) {
		if (!data) {
			return;
		}

		if (!this._data) {
			// If _data doesn't exist, create a new document
			const newDocument = new this._model({ data });
			const savedDocument = await newDocument.save();
			this._data = savedDocument;
			return savedDocument;
		} else {
			// If _data exists, update the existing document
			const existingDocument = await this._model.findById(this._data._id);

			if (!existingDocument) {
				throw new Error("Document not found");
			}

			existingDocument.data = data;
			await existingDocument.save();
			this._data = existingDocument;
			return existingDocument;
		}
	}
}
