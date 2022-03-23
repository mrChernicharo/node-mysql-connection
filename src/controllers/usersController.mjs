import { db } from "../db.mjs";
import { getCurrentTimestamp } from "../utils/functions.mjs";

export class UsersController {
  db;
  constructor(db) {
    this.db = db;
    console.log("created!");
  }

  async listAllUsers() {
    const [rows, fields] = await db.execute("select * from users;");
    return rows;
  }

  async getUserById({ id }) {
    const [rows, fields] = await db.execute(
      `select * from users where id = ${id};`
    );
    return rows[0];
  }

  async getUserByNick({ nick }) {
    const [rows, fields] = await db.execute(
      `select * from users where name = ${nick};`
    );
    return rows[0];
  }

  async createUser({ name, email }) {
    await db.execute(
      `insert into users (name, email, created_at) values ('${name}', '${email}', '${getCurrentTimestamp()}');`
    );

    const [rows, fields] = await db.execute(
      "select max(id)  as maxId from users;"
    );

    const { maxId } = rows[0];
    const user = await this.getUserById({ id: maxId });
    return user;
  }

  async updateUser({ id, name, email }) {
    const userData = { name, email };
    const instructions = [];

    Object.entries(userData).forEach(([k, v]) => {
      if (!!v) instructions.push(`${k} = '${v}'`);
    });

    if (!instructions.length) return [];

    const query = `update users set ${instructions} where id = ${id}`;

    const [rows, fields] = await db.execute(query);
    const user = await this.getUserById({ id });

    return user;
  }

  async deleteUser({ id }) {
    const user = await this.getUserById({ id });

    const [rows, fields] = await db.execute(
      `delete from users where id = ${id};`
    );

    return user;
  }
}

const usersController = new UsersController(db);

export { usersController };
