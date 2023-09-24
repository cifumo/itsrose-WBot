import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pluginFolders = path.join(__dirname, "..", "plugins");

export { pluginFolders };
