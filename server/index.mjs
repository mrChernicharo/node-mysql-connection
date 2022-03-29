import dotenv from 'dotenv';
import { app } from './root.mjs';
import { io } from './io.mjs';
dotenv.config();

const PORT = process.env.PORT || 3333;

io.listen('3334');

app.listen(PORT, () => {
	console.log(`server listening at port:${PORT}`);
});
