import express from "express";
import UserController from "../controllers/user";
const router = express.Router();
const _userController = new UserController();

router.post("/login", _userController.getToken);
router.delete("/delete", _userController.deleteUser);

export default router;
