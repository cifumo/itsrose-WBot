import config from "../../config.js";

export default String(config.MONGODB_URI || "mongodb://localhost:27017");
