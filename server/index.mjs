import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

import { usersRoutes } from './routes/userRoutes.mjs';

const app = express();
app.use(
	cors({
		origin: '*',
	})
);

app.use(express.json());

const PORT = process.env.PORT || 3334;

app.use('/users', usersRoutes);

app.listen(PORT, () => {
	console.log(`server listening at port:${PORT}`);
});
