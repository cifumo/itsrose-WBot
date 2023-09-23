import { Low } from "lowdb";
import lodash from "lodash";
import Database from "./Databases/Database.js";

const _database = new Database();
let database = new Low(_database);
/* yes */
async function load_database() {
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

export { load_database, database };
export default database;
