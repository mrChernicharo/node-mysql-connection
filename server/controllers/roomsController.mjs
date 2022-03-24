import { db } from '../db.mjs';
import { getCurrentTimestamp } from '../utils/functions.mjs';

export class RoomsController {
	db;
	constructor(db) {
		this.db = db;
	}

	async listAllRooms() {
		const [rows, fields] = await db.execute(`select * from rooms`);

		return rows;
	}

	async createRoom({ roomName }) {
		const [response] = await db.execute(
			`insert into rooms (name, created_at) values ('${roomName}', '${getCurrentTimestamp()}')`
		);

		console.log(response);
	}
}

const roomsController = new RoomsController(db);

export { roomsController };
