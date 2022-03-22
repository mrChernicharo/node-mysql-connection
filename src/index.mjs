import express from "express";
import dotenv from "dotenv";
dotenv.config();

import { usersRoutes } from "./routes/users.mjs";

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3334;

app.use("/users", usersRoutes);

app.listen(PORT, () => {
  console.log(`server listening at port:${PORT}`);
});
