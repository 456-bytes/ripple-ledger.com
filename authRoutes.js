import { Router } from "express";
import authController from "./controllers/authController.js";
import passwordController from "./controllers/passwordController.js";


const router = Router();

// Auth routes
router.get("/signup", authController.signup_get);
router.get("/login", authController.login_get);
router.post("/signup", authController.signup_post);
router.post("/login", authController.login_post);
router.get("/logout", authController.logout_get);

// reset password
router.get("/forgot-password", passwordController.forgotPassword_get);
router.post("/forgot-password", passwordController.forgotPassword_post);
router.get("/reset_password/:token", passwordController.resetPassword_get);
router.post("/reset_password/:token", passwordController.resetPassword_post);


// ✅ OTP verification route
router.post("/verify", authController.verify_post);

export default router;
