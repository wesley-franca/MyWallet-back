import express from "express";
import cors from "cors";

import authRouter from "./routers/Auth.routes.js";
import movimentatioRouter from "./routers/Movimentation.routes.js";

const server = express();

server.use(express.json());
server.use(cors());

server.use(authRouter);
server.use(movimentatioRouter);

server.listen(5000, () => { console.log("listen on 5000") });