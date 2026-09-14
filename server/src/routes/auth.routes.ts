import express from "express";

import { authenticate } from "../middleware/auth.middleware";
import {
  register,
  login,
  getMe,
  forgotPassword,
  resetPasswordController,
} from "../controllers/auth.controller";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/me", authenticate, getMe);

router.post("/forgot-password", forgotPassword);

router.post(
  "/reset-password",
  resetPasswordController
);

export default router;