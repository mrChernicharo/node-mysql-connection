import { db } from '../db.mjs';
import { getCurrentTimestamp } from '../utils/functions.mjs';

export class RoomsController {
	db;
	constructor(db) {
		this.db = db;
	}

	async getRoomById({ id }) {
		const [rows, fields] = await db.execute(
			`select * from rooms where id = ${id};`
		);
		console.log(rows);
		return rows[0] ?? null;
	}

	async listAllRooms() {
		const [rows, fields] = await db.execute(`select * from rooms`);

		return rows;
	}

	async createRoom({ roomName, userId }) {
		const [response] = await db.execute(
			`insert into rooms (name, created_at) values ('${roomName}', '${getCurrentTimestamp()}')`
		);

		const { insertId } = response;

		console.log('received', userId);
		await this.addUserToRoom({ userId, roomId: insertId }); //

		const room = await this.getRoomById({ id: insertId });

		return room;
	}

	async addUserToRoom({ userId, roomId }) {
		const [response] = await db.execute(
			`insert into users_rooms (fk_user_id, fk_room_id, joined_at) values
            ('${userId}','${roomId}','${getCurrentTimestamp()}');`
		);

		console.log('added user to room', response);

		return response;
	}

	async getRoomUsers({ roomId }) {
		const [response] = await db.execute(
			`select ur.id as item, r.id as room_id, r.\`name\` as room, u.id as user_id, u.nickname as \`user\` from users_rooms as ur
            left join users as u on u.id = ur.fk_user_id
            left join rooms as r on r.id = ur.fk_room_id
            where r.id = ${roomId};`
		);

		console.log('getting all users from room ' + roomId, response);

		return response;
	}

	async deleteRoom({ id }) {
		const room = this.getRoomById({ id });

		await db.execute(`delete from rooms where id = '${id}';`);

		return room;
	}
}

const roomsController = new RoomsController(db);

export { roomsController };
