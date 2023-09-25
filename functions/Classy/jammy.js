import { Api } from "./API/index.js";
import config from "../../config.js";

export class Jammy extends Api {
	constructor() {
		super(...arguments);
		this.real_time = config.openAI.real_time;
		this.timeZone = config.openAI.timeZone;
		this.system_content = config.openAI.system_content;
	}
	_date() {
		return new Date().toLocaleString("en-US", {
			day: "numeric",
			month: "long",
			year: "numeric",
			weekday: "long",
			timezone: this.timeZone || "Asia/Jakarta",
		});
	}
	_clock() {
		return new Date().toLocaleString("en-us", {
			timeZone: this.timeZone || "Asia/Jakarta",
			hour12: false,
			hour: "numeric",
			minute: "numeric",
			second: "numeric",
		});
	}
	_model() {
		return { model: "gpt-3.5-turbo" };
	}
	_user(m) {
		let name = m.name?.split(" ")[0]?.trim() || "User";
		name = name?.match(/^[a-zA-Z0-9_-]{1,64}$/) ? name : "User";
		return {
			role: "user",
			content: m.text,
			name,
		};
	}
	_system(content = "Act like girl named 'rose'", role = "system") {
		if (this.real_time) {
			content = `${
				this.system_content
			}. Today is ${this._date()}. Now is ${this._clock()}.`;
		}
		return {
			role,
			content,
		};
	}
	_assistant(content, role = "assistant") {
		return {
			role,
			content,
		};
	}
}
