import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { authenticate } from "../middleware/auth";
import { JWT_SECRET } from "../config/env";
import { pool } from "../config/database";


const router = express.Router();

router.post("/register", async (req,res) => {
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

router.post("/login", async (req,res) => {
  const { email, password } = req.body;

  if(!email || !password) {
    return res.status(401).json({
        message: "Invalid email or password"
    })
  };
  const result = await pool.query(
    `SELECT id, email, password_hash 
     FROM users
     WHERE email = $1`,
    [email]
  );

  if (result.rows.length === 0) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }

  const user = result.rows[0];

  const passwordMatches = await bcrypt.compare(
    password,
    user.password_hash
  );

  if (!passwordMatches) {
    return res.status(401).json({
      message: "Invalid email or password"
    })
  }

  const token = jwt.sign(
    {
        userId: user.id,
        email: user.email
    },
    JWT_SECRET,
    {
        expiresIn: "1h"
    }
  );
  return res.json({
    token,
  })
});

router.get("/me", authenticate, (req, res) => {
  res.json({
    user: req.user
  })
});

export default router