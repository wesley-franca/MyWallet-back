import express from "express";

import * as movimentationController from "../controllers/Movimentation.controller.js";

const router = express.Router();

router.post("/movimentation", movimentationController.createMovimentation);

router.get("/movimentation", movimentationController.listMovimentations);

export default router;