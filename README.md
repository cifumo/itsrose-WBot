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
      execute: function(m, params) {
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
   const handler = async (m, { conn, text, args, usedPrefix, plugins }) => {
     // your code here
   };

   handler.command = ["command"];
   handler.tags = ["tags"];
   handler.help = ["help"];

   export default handler;
   ```

3. Is it same as like [games-wabot](https://github.com/BochilGaming/games-wabot/tree/multi-device)? Yes, it is.

## Expanding

If you have `base code` that using something you call `case` and you want to use it in this source code, you can do this:

1. Edit file in `case/index.js`
2. Fill what you want to do
3. Edit `config.js` and set `use_case` to `true`

But remember, the `base code` must be using `Baileys` API.

Advantages:
- The code in `case/index.js` will be executed before the plugin is executed.
- If the command is same in `plugin` and `case/index.js`, the `case/index.js` will be executed first.

I recommend to migrate your `base code` to the way plugins are written.
## Disclaimer

This repository project is using other open source projects. No warranties are made as to the usability of the source code contained herein. Any use of this code is subject to an understanding that the code itself is not guaranteed to be fit for any particular purpose and the user is solely responsible for any repercussions of its use. No guarantee is given as to the accuracy or correctness of the results obtained from using the code in this repository. 

This repository project uses other open source projects, the authors or owners of which may have different license terms from the code contained in this repository. You should consult the individual license terms of those projects before using the code. 

The authors and maintainers of this repository project are not responsible for any damage or loss arising from the use of the code contained herein. Use the code at your own risk.

## Contributing

You can contribute in many ways:
```
1. Report bugs
2. Give suggestions
3. Fork and make pull request
```
You can add more features, fix bugs, or anything else.

## Thanks to

- [Baileys](https://github.com/WhiskeySockets/Baileys)
  - For the WhatsApp API.
- [OpenAI](https://openai.com)
  - For the AI API.
- [games-wabot](https://github.com/BochilGaming/games-wabot/tree/multi-device)
  - For the inspiration.
- [itsrose](https://itsrose.life)
  - For the API.
- [Danil](danil.gay)
  - For the inspiration.