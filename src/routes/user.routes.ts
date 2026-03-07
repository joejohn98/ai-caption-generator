import { Router } from "express";
import { getMe, updateMe, deleteMe } from "../controllers/user.controller";
import protect from "../middlewares/protect.middleware";

const router = Router();

router.get("/", protect, getMe);

router.put("/", protect, updateMe);

router.delete("/", protect, deleteMe);

export default router;
