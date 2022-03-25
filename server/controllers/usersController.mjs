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
			`select * from users where id = '${id}';`
		);
		return rows[0] ?? null;
	}

	async getUserByNick({ nickname }) {
		const [rows, fields] = await db.execute(
			`select * from users where nickname = '${nickname}';`
		);
		console.log(rows);
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
		const [rows, fields] = await db.execute(
			`delete from users where id = ${id};`
		);
		return rows;
	}

	async getUserRooms({ userId }) {
		const [response] = await db.execute(
			`select ur.id as item, r.id as room_id, r.\`name\` as room, u.id as user_id, u.nickname as \`user\` from users_rooms as ur
            left join users as u
            on u.id = ur.fk_user_id
            left join rooms as r
            on r.id = ur.fk_room_id
            where u.id = ${userId};`
		);

		console.log('gotten user rooms', response);

		return response;
	}
}

const usersController = new UsersController(db);

export { usersController };
