import { db, dbEvents } from '../db.mjs';
import { getCurrentTimestamp } from '../utils/functions.mjs';

export class UserRoomController {
	db;
	dbEvents;
	constructor(db, dbEvents) {
		this.db = db;
		this.dbEvents = dbEvents;
		this.dbEvents.on('addUserToRoom', data => {
			console.log('just heard addUserToRoom', { data });
			this.addUserToRoom(data);
		});
	}

	async getUserRooms({ userId }) {
		console.log('getting with id ' + userId);
		const [response] = await db.execute(
			`select ur.id as item, r.id as room_id, r.\`name\` as room, u.id as user_id, u.nickname as \`user\` 
			from user_room as ur
            left join user as u
            on u.id = ur.fk_user_id
            left join room as r
            on r.id = ur.fk_room_id
            where u.id = ${userId};`
		);

		console.log('gotten user rooms', response);

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

	async addUserToRoom({ userId, roomId }) {
		const [response] = await db.execute(
			`insert into user_room (fk_user_id, fk_room_id, joined_at) values
            ('${userId}','${roomId}','${getCurrentTimestamp()}');`
		);

		// console.log('added user to room', response);

		return response;
	}
}

const userRoomController = new UserRoomController(db, dbEvents);
export { userRoomController };
