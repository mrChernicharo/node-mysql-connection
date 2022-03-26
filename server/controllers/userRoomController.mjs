import { db } from '../db.mjs';
import { getCurrentTimestamp } from '../utils/functions.mjs';

export class UserRoomController {
	db;
	constructor(db) {
		this.db = db;
	}
}

const userRoomController = new UserRoomController(db);
export { userRoomController };
