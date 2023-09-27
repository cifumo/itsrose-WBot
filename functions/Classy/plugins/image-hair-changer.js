import { Api } from "../API/index.js";

export default function image_hair_changer() {
	return {
		name: "image_hair_changer",
		description: "Change hair style of image",
		parameters: {
			type: "object",
			properties: {
				hair_id: {
					type: "string",
					description: "The hair id to change to",
					default: "layered_1",
					enum: [
						"layered_1",
						"airy_bangs",
						"fishtail",
						"blunt_bangs",
						"school_girl",
						"ripples_2",
						"long_curtains_1",
						"cockhorse",
						"side_split_1",
						"straight_hair_1",
						"mermaid",
						"egg_roll",
						"curly_hair",
						"layered_2",
						"long_curtains_2",
						"barbie",
						"airy_long",
						"side_fringe",
						"straight_hair_2",
						"french",
						"ripples_1",
						"long_curtains_3",
						"peach-shaped",
						"slicked-back",
						"comma_hair",
						"coside_split_2de",
						"natural",
						"k-style",
						"shor_curls",
					],
				},
			},
			required: ["hair_id"],
		},
		execute: async function (m, params) {
			const q = m.quoted ? m.quoted : m;
			const mime = q.mtype || "";
			if (!/image/.test(mime)) {
				return {
					type: "text",
					response: {
						status: "failed",
						message: "You need to reply the image or send the image with caption",
					},
				};
			}
			const { hair_id } = params;
			const imageBuffer = await q.download();
			const formData = new FormData();
			const blob = new Blob([imageBuffer], { type: "image/jpg" });
			formData.append("file", blob, "image.jpg");
			const { data } = await Api.request({
				url: "/image/differentMe",
				method: "POST",
				params: {
					hair_id,
					json: true,
				},
				data: formData,
			}).catch((e) => e?.response);
			const { status, result, message } = data;
			if (!status) {
				return {
					type: "text",
					response: {
						status: "failed",
						message,
						tips: "Probably face not detected in image",
					},
				};
			}
			return {
				type: "image",
				image: Buffer.from(result["base64Image"], "base64"),
				response: {
					content: "Success!",
					message: "Success change hair in image",
					hair_id,
				},
			};
		},
	};
}
