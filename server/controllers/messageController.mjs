import { db, dbEvents } from '../db.mjs';
import { getCurrentTimestamp } from '../utils/functions.mjs';

export class MessageController {
	db;
	dbEvents;

	constructor(db, dbEvents) {
		this.db = db;
		this.dbEvents;
	}

	async getRoomMessages({ roomId }) {
		const [messages] = await this.db.execute(`
			select id as id_msg,
			(select \`nickname\` from \`user\` where id = fk_user_id) as \`user\`, 
			\`text\`, 
			created_at as \`sent_at\`
			from message
			where fk_room_id = '${roomId}'
			order by created_at asc;
		`);

		return messages;
	}

	async createMessage({ userId, roomId, text }) {
		const [result] = await this.db.query(
			`insert into message (text, created_at, fk_user_id, fk_room_id) values ( ?, ?, ?, ? );`,
			[text, getCurrentTimestamp(), userId, roomId]
		);
		const { insertId } = result;

		const [message, buffers] = await db.execute(
			`select id as message_id, text, created_at, 
			(select id from user where id = fk_user_id) as user_id, 
			(select nickname from user where id = fk_user_id) as user, 
			(select id from room where id = fk_room_id) as room_id, 
			(select name from room where id = fk_room_id) as room_name 
			from message where id = ?;`,
			[insertId]
		);
		return message[0];
	}
}

const messageController = new MessageController(db, dbEvents);
export { messageController };
