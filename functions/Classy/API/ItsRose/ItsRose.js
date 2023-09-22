import axios from "axios";

export default class ItsRose {
	constructor(key) {
		this.key = key;
		this.baseURL = "https://api.itsrose.life";
		this.axios = axios.create({
			baseURL: this.baseURL,
			headers: {
				Authorization: this.key,
			},
		});
	}
}
