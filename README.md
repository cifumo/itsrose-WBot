# itsrose-WBot
Danil Elistzakov's

## Advantages
- [x] OpenAI
  - I use openai to make this bot more intelligent.
  - Sometimes the openai API will give you rate limit error, so you need to wait for a few minutes. Otherwise, pay for the API.
- [ ] MongoDB
  - I want to use mongodb to store the data, but idk.


## Installation
1. Install [Node.js](https://nodejs.org/en/download/)
2. Install [Git](https://git-scm.com/downloads)
3. Clone this repository
```bash
git clone https://github.com/xct007/itsrose-WBot
```
4. Install the dependencies
```bash
npm install
```
## Configuration
1. Rename `.env.example` to `.env` or create a file named `.env`
2. Edit `.env` and fill in the values:
   ```env
    MONGODB_URI=mongodb_uri
    ITSROSE_API_KEY=itsrose_apikey
    OPENAI_API_KEY=openai_apikey
    ```
3. Edit `config.js` and fill in the values.
4. See more information about MongoDB [here](https://docs.mongodb.com/manual/installation/)
5. See more information about itsrose API [here](https://itsrose.life/)
6. See more information about OpenAI API [here](https://beta.openai.com/docs/api-reference/introduction)
7. Run the bot
```bash
npm start
```

## Writing OpenAI plugin
1. Create a file named `plugin_name.js` in `functions/Classy/plugins` folder
2. Edit `plugin_name.js` and fill in the values like this:
    ```js
    import module from "your_module.js";

    export default function name() {
		name: "plugin_name",
		description: "plugin_description",
		parameters: {
			type: "object",
			properties: {
				parameter_name: {
					type: "string",
					description: "parameter_description"
				}
			},
			required: ["parameter_name"]
        }
        execute: function (m, params) {
			// execute the module
        	const result = module(params.parameter_name);

          	// return the result as object
			// so the bot can send the message
			// is using baileys API

			// if you want to send message as text, use this
          	return {
            	type: "text", // type
            	response: {
					// this is the information 
					// about the text
					// so OPENAI use it.
					content: result
				}
          	};
			// if you want to send message as image/video, use this
		  	return {
				type: "image", // type

				// sending image as url
				image: {
					url: "image_url"
				},
				// image: Buffer.from("image_buffer"),
				response: {
					// this is the information
					// about the image
					// so OPENAI use it.
					content: "Here you image"
				}
		  	};
        }
    }
    ```
3. See more information about OpenAI function [here](https://platform.openai.com/docs/guides/gpt/function-calling)

## Writing Plugin
1. Create a file named `plugin_name.js` in `plugins` folder
2. Edit `plugin_name.js` and fill in the values like this:
   ```js
	const handler = async (m, { 
		conn, 
		text, 
		args, 
		usedPrefix, 
		plugins 
	}) => {
		// your code here
	};

	// same as like games-wabot
	handler.command = ["menu", "help", "start"];
	handler.tags = ["main"];
	handler.help = ["menu", "help", "start"];

	export default handler;
	``` 
3. Is it same as like [games-wabot](https://github.com/BochilGaming/games-wabot/tree/multi-device)? Yes, it is. 

## Expanding
1. Edit file in `case/index.js`
2. Fill what you want to do
3. Edit `config.js` and set `use_case` to `true`

## Disclaimer
- I'm not responsible for any misuse of this bot.
- I'm not responsible for any damage caused by this bot.
- I'm not responsible for any damage caused by the API.
- I'm not responsible for any damage caused by the dependencies.
- I'm not responsible for any damage caused by the code.
- I'm not responsible for any damage caused by the user.
- I'm not responsible for any damage caused by the user's device.
- I'm not responsible for any damage caused by the user's network.
- I'm not responsible for any damage caused by the user's internet connection.
- I'm not responsible for any damage caused by the user's electricity.
- I'm not responsible for any damage caused by the user's house.
- I'm not responsible for any damage caused by the user's country.
- I'm not responsible for any damage caused by the user's planet.
- I'm not responsible for any damage caused by the user's solar system.
- I'm not responsible for any damage caused by the user's galaxy.
- I'm not responsible for any damage caused by the user's universe.
- I'm not responsible for any damage caused by the user's multiverse.
- I'm not responsible for any damage caused by the user's omniverse.
- I'm not responsible for any damage caused by the user's metaverse.
- Don't use this bot source code for illegal purposes.
- Don't sell this bot source code.
- Don't sell this bot.

## Support me by donating
- [PayPal](https://paypal.me/xct007)
- [Saweria](https://saweria.co/xct007)
- [Trakteer](https://trakteer.id/xct007)
- [KaryaKarsa](https://karyakarsa.com/xct007)
- [Ko-fi](https://ko-fi.com/xct007)
- [BuyMeACoffee](https://www.buymeacoffee.com/xct007)
- [LiberaPay](https://liberapay.com/xct007)
- [GitHub Sponsors](https://github.com/xct007)
- [GitLab Sponsors](https://gitlab.com/xct007)
- [Open Collective](https://opencollective.com/xct007)
- [Patreon](https://patreon.com/xct007)
- wkwk..