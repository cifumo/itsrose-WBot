import "dotenv/config";
console.log(process.env);
import startsocks from "./lib/connection.js";
import { MessageHandler, rosie } from "./lib/message.js";

rosie.load_functions();
rosie.load_plugins();
rosie.load_database();
startsocks(MessageHandler);
