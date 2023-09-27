import { Api } from "../API/index.js";

export default function image_convert() {
	return {
		name: "image_convert",
		description: "Convert image to another style",
		parameters: {
			type: "object",
			properties: {
				style: {
					type: "string",
					description: "The style to convert image in",
					default: "anime",
					enum: [
						"color_line",
						"fresh",
						"makima",
						"cat_ears",
						"full_bloom",
						"angel",
						"gracefull",
						"cold",
						"snow_fall",
						"manga",
						"charming",
						"stipple",
						"cg",
						"idol",
						"comic_world",
						"princess",
						"anime25d",
						"realistic",
						"anime",
						"comic",
						"manhwa",
						"manhwa_female",
						"manhwa_male",
						"jewelry",
						"jewelry_sky",
						"basketball",
						"summer",
						"cute_child",
						"makeup_sunny",
						"anime_idol",
						"azure_sky",
						"today",
						"majestic",
						"ftlove",
						"loveft",
						"samyang",
						"student",
						"baby",
						"anime_1",
						"anime_2",
						"anime_3",
						"anime_4",
						"drawing",
					],
				},
			},
			required: ["style"],
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
			const { style } = params;
			const imageBuffer = await q.download();
			const formData = new FormData();
			const blob = new Blob([imageBuffer], { type: "image/jpg" });
			formData.append("file", blob, "image.jpg");
			const { data } = await Api.request({
				url: "/image/differentMe",
				method: "POST",
				params: {
					style,
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
					},
				};
			}
			return {
				type: "image",
				image: Buffer.from(result["base64Image"], "base64"),
				response: {
					content: "Success!",
					message: "Success converting image",
					style,
				},
			};
		},
	};
}
