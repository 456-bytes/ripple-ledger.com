import { Router } from "express";
import authController from "./controllers/authController.js";

const router = Router();

// Auth routes
router.get("/signup", authController.signup_get);
router.get("/login", authController.login_get);
router.post("/signup", authController.signup_post);
router.post("/login", authController.login_post);
router.get("/logout", authController.logout_get);

// ✅ OTP verification route
router.post("/verify", authController.verify_post);

export default router;
