import express from "express";

import * as movimentationController from "../controllers/Movimentation.controller.js";
import hasUser from "../middlewares/User.middleware.js";

const router = express.Router();

router.use(hasUser)

router.post("/movimentation", movimentationController.createMovimentation);
router.get("/movimentation", movimentationController.listMovimentations);

export default router;