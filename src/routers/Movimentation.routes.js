import express from "express";
import * as movimentationController from "../controllers/Movimentation.controller.js";
import hasUser from "../middlewares/User.middleware.js";

const router = express.Router();

router.post("/movimentation", movimentationController.createMovimentation);
router.get("/movimentation", movimentationController.listMovimentations);
router.delete("/movimentation", hasUser, movimentationController.deleteMovimentation);

export default router;