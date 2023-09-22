import "dotenv/config";
console.log(process.env);
import { loadDatabase } from "./lib/database.js";
import startsocks from "./lib/connection.js";

await loadDatabase();
startsocks();
