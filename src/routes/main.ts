import express from "express";
const router = express.Router();

import mainController from "../controllers/main";

router.get("/", mainController.index);

export default router;
