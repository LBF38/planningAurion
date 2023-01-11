import express from "express";
const router = express.Router();

import userController from "../controllers/user";

router.post("/login", userController.getToken);
router.delete("/delete", userController.deleteUser);

export default router;
