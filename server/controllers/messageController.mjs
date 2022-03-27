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
}

const messageController = new MessageController(db);
export { messageController };
