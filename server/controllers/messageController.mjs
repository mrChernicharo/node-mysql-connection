import { db } from '../db.mjs';
import { getCurrentTimestamp } from '../utils/functions.mjs';

export class MessageController {
	db;
	constructor(db) {
		this.db = db;
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
		const [result] = await this.db.execute(
			`insert into \`message\`
			(\`text\`, created_at, fk_user_id, fk_room_id) 
			values
    		('${text}', '${getCurrentTimestamp()}', ${userId}, ${roomId});`
		);
		const { insertId } = result;

		const [message, buffers] = await db.execute(
			`select 
			id, text, created_at, (select nickname from user where id = fk_user_id) as user
			 from \`message\` where id = '${insertId}';`
		);

		return message;
	}
}

const messageController = new MessageController(db);
export { messageController };
