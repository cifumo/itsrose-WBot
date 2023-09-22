import Database from "../Databases/Database.js";
import lodash from "lodash";

const database = new Database();

/* yes */
export async function loadDatabase() {
	if (database._read) {
		await database._read;
	}
	if (database.data !== null) {
		return database.data;
	}
	database._read = database.read().catch(console.error);
	await database._read;
	database.data = {
		users: {},
		chats: {},
		...(database.data || {}),
	};
	database.chain = lodash.chain(database.data);

	return database.data;
}
