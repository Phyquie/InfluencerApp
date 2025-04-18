import express from "express";
import { signup, login, verifyOtp, logout, getMe } from "../controller/auth.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/verify-otp", verifyOtp);
router.post("/logout", logout);
router.get("/me",protectRoute, getMe);

export default router;