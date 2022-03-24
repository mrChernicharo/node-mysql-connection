import { db } from '../db.mjs';
import { getCurrentTimestamp } from '../utils/functions.mjs';

export class UsersController {
	db;
	constructor(db) {
		this.db = db;
	}

	async listAllUsers() {
		const [rows, fields] = await db.execute('select * from users;');
		return rows;
	}

	async getUserById({ id }) {
		const [rows, fields] = await db.execute(
			`select * from users where id = ${id};`
		);
		return rows[0] ?? null;
	}

	async getUserByNick({ nickname }) {
		const [rows, fields] = await db.execute(
			`select * from users where nickname = '${nickname}';`
		);
		return rows[0] ?? null;
	}

	async createUser({ nickname }) {
		const existingUser = await this.getUserByNick({ nickname });

		if (existingUser) throw Error('nickname taken, please try another');

		const [response] = await db.execute(
			`insert into users (nickname, created_at) values 
            ('${nickname}', '${getCurrentTimestamp()}');`
		);
		const { insertId } = response;

		const user = await this.getUserById({ id: insertId });
		return user;
	}

	async updateUser({ id, nickname }) {
		try {
			const userData = { nickname };
			const instructions = [];

			Object.entries(userData).forEach(([k, v]) => {
				if (!!v) instructions.push(`${k} = '${v}'`);
			});

			if (!instructions.length) return await this.getUserById({ id });

			const query = `update users set ${instructions} where id = ${id}`;
			await db.execute(query);

			const user = await this.getUserById({ id });

			return user;
		} catch (err) {
			throw Error(err);
		}
	}

	async deleteUser({ id }) {
		console.log(id);
		// return id;
		const [rows, fields] = await db.execute(
			`delete from users where id = ${id};`
		);
		return rows;
	}
}

const usersController = new UsersController(db);

export { usersController };
