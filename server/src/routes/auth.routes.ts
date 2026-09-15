import express from "express";

import { authenticate } from "../middleware/auth.middleware";
import {
  register,
  login,
  getMe,
  forgotPassword,
  resetPasswordController,
} from "../controllers/auth.controller";
import { authRateLimiter } from "../middleware/rateLimiter.middleware";

const router = express.Router();

router.use(authRateLimiter);

router.post("/register", register);

router.post("/login", login);

router.get("/me", authenticate, getMe);

router.post("/forgot-password", forgotPassword);

router.post(
  "/reset-password",
  resetPasswordController
);

export default router;