import { Api } from "../API/index.js";

export default function stable_diffusion() {
	return {
		name: "stable_diffusion",
		description: "Generate image from text in english using Stable Diffusion",
		parameters: {
			type: "object",
			properties: {
				prompt: {
					type: "string",
					description: "The prompt to generate image from",
				},
				style: {
					type: "string",
					description: "The style to generate image in",
					default: "Realistic",
					enum: [
						"ACG",
						"90s Comic",
						"Realistic",
						"Color Illustration",
						"Pencil Sketch",
						"Game CG",
						"Super Hero",
						"Wild",
						"Z Fighters",
						"Asian",
						"Ink and Wask",
						"Ninja",
						"Chibi",
						"Fantastic JOJO",
						"Cyberpunk",
					],
				},
			},
			required: ["prompt", "style"],
		},
		execute: async function (m, params) {
			const { prompt, style } = params;
			const { data } = await Api.request({
				url: "/image/diffusion",
				method: "POST",
				data: {
					prompt,
					negative_prompt: "(worst quality, low quality, extra hand), monochrome",
					sampler: "Euler a",
					seed: -1,
					ratio: "1:1",
					style,
					cfg: 7.5,
					controlNet: "none",
					image_num: 1,
					steps: 25,
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
			const url = result.images[0];
			return {
				type: "image",
				image: {
					url,
				},
				response: {
					content: "Here your image!",
					message: "Image generated successfully!",
					url,
				},
			};
		},
	};
}
