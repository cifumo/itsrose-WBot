import axios from "axios";
import { fileTypeFromBuffer } from "file-type";
import config from "../config.js";

class Imgbb {
	constructor() {
		this._session = axios.create({
			baseURL: "https://api.imgbb.com",
			timeout: 10000,
		});
		this._init = false;
		this._key = config.apikey.imgbb;
	}
	init() {
		if (this._init) {
			return;
		}
		this._session.interceptors.response.use(
			(response) => {
				return response;
			},
			(error) => {
				if (error.response.status === 403) {
					throw new Error("API key is invalid");
				}
				return Promise.reject(error);
			}
		);
		this._init = true;
	}
	async upload(buffer) {
		if (!this._init) {
			this.init();
		}
		const form = new FormData();
		form.append("image", Buffer.from(buffer).toString("base64"));
		const { data } = await this._session.request({
			url: "/1/upload",
			method: "POST",
			data: form,
			params: {
				key: this._key,
			},
		});
		return data.data;
	}
}
class TelegraPh {
	constructor() {
		this._session = axios.create({
			baseURL: "https://telegra.ph/",
			timeout: 10000,
		});
	}
	async upload(buffer) {
		const { ext, mime } = await fileTypeFromBuffer(buffer);
		const form = new FormData();
		const blob = new Blob([buffer], { type: mime });
		form.append("file", blob, "tmp." + ext);
		const { data } = await this._session.post("upload", form, {});
		return data;
	}
}
class Imgur {
	constructor() {
		this._session = axios.create({
			baseURL: "https://api.imgur.com/3/",
			timeout: 10000,
		});
		this._init = false;
		this._key = config.apikey.imgur;
	}
	init() {
		if (this._init) {
			return;
		}
		this._session.interceptors.response.use(
			(response) => {
				return response;
			},
			(error) => {
				if (error.response.status === 403) {
					throw new Error("API key is invalid");
				}
				return Promise.reject(error);
			}
		);
		this._init = true;
	}
	async upload(buffer) {
		if (!this._init) {
			this.init();
		}
		const form = new FormData();
		form.append("image", Buffer.from(buffer).toString("base64"));
		const { data } = await this._session.request({
			url: "/1/upload",
			method: "POST",
			data: form,
			params: {
				key: this._key,
			},
		});
		return data.data;
	}
}
export class Uploader {
	constructor() {
		this._imgbb = new Imgbb();
		this._telegraph = new TelegraPh();
		this._imgur = new Imgur();
	}
	async imgbb(buffer) {
		const { image } = await this._imgbb.upload(buffer);
		return image.url;
	}
	async telegraph(buffer) {
		const src = await this._telegraph.upload(buffer);
		if (Array.isArray(src)) {
			for (const obj of src) {
				if (obj.src) {
					return "https://telegra.ph" + obj.src;
				}
			}
		}
		throw new Error("Failed to upload image to telegra.ph");
	}
	async imgur(buffer) {
		const { link } = await this._imgur.upload(buffer);
		return link;
	}
}

const uploader = new Uploader();

export default uploader;
