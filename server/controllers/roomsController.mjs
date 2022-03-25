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

	async createRoom({ roomName }) {
		const [response] = await db.execute(
			`insert into rooms (name, created_at) values ('${roomName}', '${getCurrentTimestamp()}')`
		);

		const { insertId } = response;
		const room = await this.getRoomById({ id: insertId });

		return room;
	}

	async deleteRoom({ id }) {
		const room = this.getRoomById({ id });

		await db.execute(`delete from rooms where id = '${id}';`);

		return room;
	}
}

const roomsController = new RoomsController(db);

export { roomsController };
