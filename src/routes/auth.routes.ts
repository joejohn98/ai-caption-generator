import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/auth.controller";
import protect from "../middlewares/protect.middleware";

const router = Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/logout", protect, logoutUser);

export default router;
