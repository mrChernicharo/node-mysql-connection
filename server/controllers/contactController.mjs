import { db } from '../db.mjs';
import { getCurrentTimestamp } from '../utils/functions.mjs';

export class ContactController {
	db;
	constructor(db) {
		this.db = db;
	}

	async getUserContacts({ userId }) {
		const [rows] = await this.db.execute(`
			select distinct 
				c.id as contact, 
				c.fk_user_a as id_a,
				(select nickname from \`user\` where id = c.fk_user_a) as A, 
				c.fk_user_b as id_b, 
				(select nickname from \`user\` where id =  c.fk_user_b) as B 
			from 
				contact as c left join \`user\` as u 
			on 
				c.fk_user_a = u.id or c.fk_user_b = u.id
			where 
				c.fk_user_a = '${userId}' or c.fk_user_b = '${userId}';
		`);
		console.log('contacts', rows);
		return rows || null;
	}
}

const contactController = new ContactController(db);
export { contactController };
