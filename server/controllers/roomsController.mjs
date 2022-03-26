import { db } from '../db.mjs';
import { getCurrentTimestamp } from '../utils/functions.mjs';

export class RoomsController {
	db;
	constructor(db) {
		this.db = db;
	}

	async getRoomById({ id }) {
		const [rows, fields] = await db.execute(
			`select * from room where id = ${id};`
		);
		console.log(rows);
		return rows[0] ?? null;
	}

	async listAllRooms() {
		const [rows, fields] = await db.execute(`select * from room`);

		return rows;
	}

	async createRoom({ roomName, userId }) {
		const [response] = await db.execute(
			`insert into room (name, created_at) values ('${roomName}', '${getCurrentTimestamp()}')`
		);

		const { insertId } = response;

		console.log('received', userId);
		await this.addUserToRoom({ userId, roomId: insertId }); //

		const room = await this.getRoomById({ id: insertId });

		return room;
	}

	async addUserToRoom({ userId, roomId }) {
		const [response] = await db.execute(
			`insert into user_room (fk_user_id, fk_room_id, joined_at) values
            ('${userId}','${roomId}','${getCurrentTimestamp()}');`
		);

		console.log('added user to room', response);

		return response;
	}

	async getRoomUsers({ roomId }) {
		const [response] = await db.execute(
			`select ur.id as item, r.id as room_id, r.\`name\` as room, u.id as user_id, u.nickname as \`user\` 
			from user_room as ur
            left join user as u on u.id = ur.fk_user_id
            left join room as r on r.id = ur.fk_room_id
            where r.id = ${roomId};`
		);

		console.log('getting all users from room ' + roomId, response);

		return response;
	}

	async deleteRoom({ id }) {
		const room = this.getRoomById({ id });

		await db.execute(`delete from room where id = '${id}';`);

		return room;
	}
}

const roomsController = new RoomsController(db);

export { roomsController };
