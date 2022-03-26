import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { EventEmitter } from 'events';
dotenv.config();

console.log(process.env.MYSQL_PASSWORD);
console.log(process.env.MYSQL_USER);
console.log(process.env.MYSQL_DATABASE);

const dbEvents = new EventEmitter();

const db = await mysql.createConnection({
	port: process.env.MYSQL_PORT || 3306,
	host: process.env.MYSQL_HOST || '127.0.0.1',
	user: process.env.MYSQL_USER || 'root',
	password: process.env.MYSQL_PASSWORD || '',
	database: process.env.MYSQL_DATABASE,
});

export { db, dbEvents };
