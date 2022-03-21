import express from 'express';
// import mysql from 'mysql';
import mysql2 from 'mysql2';
import dotenv from 'dotenv';

const PORT = process.env.PORT || 3333;
dotenv.config();

// console.log(process.env);

const app = express();

var pool = mysql2.createPool({
	connectionLimit: 20,
	port: process.env.MYSQL_PORT || 3306,
	host: process.env.MYSQL_HOST || '127.0.0.1',
	user: process.env.MYSQL_USER || 'root',
	password: process.env.MYSQL_PASSWORD || '',
	database: process.env.MYSQL_DATABASE,
});

pool.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
	if (error) throw error;
	console.log('connected to SQL server');
	console.log('The solution is: ', results[0].solution);
});

pool.query('SHOW TABLES', (err, res, fields) => {
	if (err) throw error;
	console.log('tables', res);
});

// pool.query('select * from users', (err, res, fields) => {
// 	if (err) throw error;
// 	console.log(
// 		'users',
// 		fields.map(f => f.name),
// 		res
// 	);
// });

// pool.query('select * from rooms', (err, res, fields) => {
// 	if (err) throw error;
// 	console.log(
// 		'rooms',
// 		fields.map(f => f.name),
// 		res
// 	);
// });

// pool.query('select * from messages', (err, res, fields) => {
// 	if (err) throw error;
// 	console.log(
// 		'messages',
// 		fields.map(f => f.name),
// 		res
// 	);
// });

pool.query(
	'select * from users_rooms where fk_user_id = 2',
	(err, res, fields) => {
		if (err) throw error;
		console.log(
			'users_rooms',
			fields.map(f => f.name),
			res
		);
	}
);

app.listen(PORT, () => {
	console.log(`server listening at port:${PORT}`);
});
