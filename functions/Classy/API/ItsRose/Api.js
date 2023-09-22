import axios from "axios";

class ItsRose {
	constructor() {
		this.baseURL = "https://api.itsrose.life";
		this.axios = axios.create({
			baseURL: this.baseURL,
			params: {
				apikey: process.env.ITSROSE_API_KEY,
			},
			headers: {
				apikey: process.env.ITSROSE_API_KEY,
			},
		});
	}
	init() {
		// Ignore http code error
		this.axios.interceptors.response.use(
			(response) => {
				return response;
			},
			(error) => {
				return error.response;
			}
		);
	}
}
const itsrose = new ItsRose();
itsrose.init();
export default itsrose;
