import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import authRouter from "./routers/Auth.routes.js";
import movimentatioRouter from "./routers/Movimentation.routes.js";

dotenv.config(); 
const server = express();

server.use(express.json());
server.use(cors());

server.use(authRouter);
server.use(movimentatioRouter);

server.listen(process.env.PORT, () => { console.log(`listen on ${process.env.PORT}`) });