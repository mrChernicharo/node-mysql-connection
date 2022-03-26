import { db } from '../db.mjs';
import { getCurrentTimestamp } from '../utils/functions.mjs';

export class ContactController {
	db;
	constructor(db) {
		this.db = db;
	}
}

const contactController = new ContactController(db);
export { contactController };
