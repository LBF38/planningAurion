import express from "express";
import UserController from "../controllers/user";
const router = express.Router();

router.post("/login", UserController.getToken);
router.delete("/delete", UserController.deleteUser);

export default router;
