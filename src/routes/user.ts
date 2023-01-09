import express from "express";
const router = express.Router();

import userController from "../controllers/user";

router.post("/login", userController.getToken);

export default router;
