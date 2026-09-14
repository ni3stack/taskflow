import { Request, Response } from "express";

import {
  registerUser,
  loginUser,
  getUserById,
  requestPasswordReset,
  resetPassword,
} from "../services/auth.service";

import { sendPasswordResetEmail } from "../services/email.service";
import { asyncHandler } from "../utils/asyncHandler";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
      return res.status(400).json({
      message: "Name, Email or password are required",
      });
  }
  const user = await registerUser(name, email, password);
  return res.status(201).json({
    user,
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }

  const result = await loginUser(email, password);

  if (!result) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }

  return res.status(200).json(result);
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  const user = await getUserById(req.user.userId);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  return res.status(200).json({
    user,
  });
});

export const forgotPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const resetRequest = await requestPasswordReset(email);

    if (resetRequest) {
      await sendPasswordResetEmail(
        resetRequest.email,
        resetRequest.resetToken
      );
    }

    return res.status(200).json({
      message:
        "If an account exists for this email, a password reset link has been sent",
    });
  }
);

export const resetPasswordController = asyncHandler(
  async (req: Request, res: Response) => {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        message: "Token or password are required",
      });
    }

    const success = await resetPassword(token, password);

    if (!success) {
      return res.status(400).json({
        message: "Invalid or expired password reset link",
      });
    }

    return res.status(200).json({
      message: "Password has been reset successfully",
    });
  }
);
