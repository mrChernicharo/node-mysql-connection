import { db } from '../db.mjs';
import { getCurrentTimestamp } from '../utils/functions.mjs';

export class MessageController {
	db;
	constructor(db) {
		this.db = db;
	}
}

const messageController = new MessageController(db);
export { messageController };
