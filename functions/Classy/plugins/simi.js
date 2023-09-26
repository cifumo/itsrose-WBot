import { Api } from "../API/index.js";

export default function simi() {
	return {
		name: "simi",
		description: "Chat with simi",
		parameters: {
			type: "object",
			properties: {
				message: {
					type: "string",
					description: "The text to chat with simi",
				},
				lc: {
					type: "string",
					description: "The language code to chat in",
				},
				level: {
					type: "number",
					description:
						"The level of the chat, the more the level, the more the simi will be toxic",
					default: 2,
				},
			},
			required: ["message", "lc", "level"],
		},
		execute: async function (m, params) {
			const { message: msg, lc, level } = params;
			const { data } = await Api.request({
				url: "/others/simi",
				method: "GET",
				params: {
					message: msg,
					lc,
					level,
				},
			}).catch((e) => e?.response);
			const { status, result, message } = data;
			if (!status) {
				return {
					type: "text",
					response: {
						message,
					},
				};
			}
			return {
				type: "text",
				response: {
					simi: result["simi"]["original"],
				},
			};
		},
	};
}
