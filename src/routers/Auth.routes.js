import express from "express";

import * as authController from "../controllers/Auth.controller.js";

const router = express.Router();

router.post("/registration", authController.registration);
router.post("/login", authController.login);
router.delete("/logout", authController.logout);

export default router;