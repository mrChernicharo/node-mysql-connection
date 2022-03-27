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
		// console.log('contacts', rows);
		return rows || null;
	}

	async createContact({ userId, contactId }) {
		const [result] = await this.db.execute(
			`insert into contact (fk_user_a, fk_user_b) values ('${userId}', '${contactId}');`
		);
		const { insertId } = result;

		const [rows, fields] = await this.db.execute(
			`select fk_user_a as A, fk_user_b as B from contact where id = ${insertId};`
		);

		const { A, B } = rows[0];

		const [contact] = await this.db.execute(
			`select nickname from user where id = '${B}';`
		);

		return contact[0];
	}
}

const contactController = new ContactController(db);
export { contactController };
