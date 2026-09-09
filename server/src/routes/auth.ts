import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { authenticate } from "../middleware/auth";
import { pool } from "../config/database";
import { authRateLimiter } from "../middleware/rateLimiter";
import { 
  login, 
  requestPasswordReset,
  resetPassword
} from "../services/authService";
import { sendPasswordResetEmail } from "../services/emailService";


const router = express.Router();

router.post("/register", authRateLimiter, async (req,res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Name, Email or password are required",
    });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const userId = crypto.randomUUID();

  try {
    const result = await pool.query(
      `
        INSERT INTO users (id, name, email, password_hash)
        VALUES ($1, $2, $3, $4)
        RETURNING id, email, created_at
      `,
      [userId, name, email, passwordHash]
    );
    res.status(201).json({
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Registration failed:", error);
    return res.status(500).json({
      message: "Unable to create account"
    });
  }


});

router.post("/login", authRateLimiter, async (req,res) => {
  const { email, password } = req.body;

  if(!email || !password) {
    return res.status(401).json({
        message: "Invalid email or password"
    })
  };
  try {
    const result = await login(email, password);

    if (!result) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }
    return res.status(200).json(result);

  } catch(error) {
    console.error("Login failed:", error);

    return res.status(500).json({
      message: "Unable to process login",
    });
  } 
});

router.get("/me", authRateLimiter, authenticate, async (req, res) => {
  const result = await pool.query(
    `
      SELECT id, name, email, created_at 
      FROM users
      WHERE id = $1
    `,
    [req.user?.userId]
  );

  if(result.rows.length === 0) {
    return res.status(404).json({
      message: "User not found"
    });
  }
  return res.status(200).json({
    user: result.rows[0]
  })
});

router.post("/forgot-password", authRateLimiter, async (req, res) => {
  const { email } = req.body;

  if(!email) {
    return res.status(400).json({
      message: "Email is required",
    })
  }

  try {
    const resetRequest = await requestPasswordReset(email);
    if (resetRequest) {
      // Email sending will move to emailService next
      await sendPasswordResetEmail(
        resetRequest.email,
        resetRequest.resetToken
      )
    }

    return res.status(200).json({
      message: "If an account exists for this email, a password reset link has been sent",
    });
  }catch (error) {
    console.error("Password reset request failed:", error);
    return res.status(500).json({
      message: "Unable to process password reset request",
    });
  }
});

router.post("/reset-password", authRateLimiter, async(req, res) => {
  const { token, password } = req.body;

  if(!token || !password){
    return res.status(400).json({
      message: "Token or password are required"
    });
  }
  try {
    const success = await resetPassword(token, password);

    if(!success) {
      return res.status(400).json({
        message: "Invalid or expired password reset link",
      });
    }

    return res.status(200).json({
      message: "Password has been reset successfully",
    });
  }catch(error) {
    console.error("Password reset failed:", error);
    return res.status(500).json({
      message: "Unable to reset password",
    })
  }
});

router.get("/test-cookie", async(_req, res) => {
  res.cookie("taskflow_test","test",{
    httpOnly: true,
    sameSite: "none",
  })

  return res.json({
    message: "Test cookie set"
  });
});

router.post("/test-csrf", (req, res) => {
  console.log("🚨 CSRF request reached backend");

  return res.json({
    message: "Request accepted",
  });
});

export default router