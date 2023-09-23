import google from "googlethis";

export default function web_search() {
	return {
		name: "web_search",
		description: "Search the web",
		parameters: {
			type: "object",
			properties: {
				query: {
					type: "string",
					description: "The query to search",
				},
			},
			required: ["query"],
		},
		execute: async function (m, params) {
			const { query } = params;
			const options = {
				page: 0,
				safe: false,
				parse_ads: false,
				additional_params: {
					hl: "en",
				},
			};
			const response = await google.search(query, options);
			return {
				type: "text",
				response: {
					results: response.results,
				},
			};
		},
	};
}
