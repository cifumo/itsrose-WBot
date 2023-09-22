import("dotenv").then((dotenv) => dotenv.config());

import startsocks from "./lib/connection.js";

startsocks();
