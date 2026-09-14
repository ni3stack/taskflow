import express from "express";

import { authenticate } from "../middleware/auth.middleware";
import { authRateLimiter } from "../middleware/rateLimiter.middleware";

import {
  register,
  login,
  getMe,
  forgotPassword,
  resetPasswordController,
} from "../controllers/auth.controller";

const router = express.Router();

router.post("/register", authRateLimiter, register);

router.post("/login", authRateLimiter, login);

router.get("/me", authRateLimiter, authenticate, getMe);

router.post("/forgot-password", authRateLimiter, forgotPassword);

router.post(
  "/reset-password",
  authRateLimiter,
  resetPasswordController
);

router.get("/test-cookie", (_req, res) => {
  res.cookie("taskflow_test", "test", {
    httpOnly: true,
    sameSite: "none",
  });

  return res.json({
    message: "Test cookie set",
  });
});

router.post("/test-csrf", (_req, res) => {
  console.log("🚨 CSRF request reached backend");

  return res.json({
    message: "Request accepted",
  });
});

export default router;