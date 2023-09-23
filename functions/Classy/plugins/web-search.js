import google from "googlethis";

// google web scraping
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
				safe: false, // Safe Search
				parse_ads: false, // If set to true sponsored results will be parsed
				additional_params: {
					// add additional parameters here, see https://moz.com/blog/the-ultimate-guide-to-the-google-search-parameters and https://www.seoquake.com/blog/google-search-param/
					hl: "en",
				},
			};
			const response = await google.search(query, options);
			console.debug("Results:", response.results);
			return {
				type: "text",
				response: {
					results: response.results,
				},
			};
		},
	};
}
