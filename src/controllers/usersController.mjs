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
    return rows;
  }

  async createUser({ name, email }) {
    const [rows, fields] = await db.execute(
      `insert into users (name, email, created_at) values ('${name}', '${email}', '${getCurrentTimestamp()}');`
    );
    return rows;
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

    return rows;
  }

  async deleteUser({ id }) {
    const [rows, fields] = await db.execute(
      `delete from users where id = ${id};`
    );

    return rows;
  }
}

const usersController = new UsersController(db);

export { usersController };
