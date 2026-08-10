import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { authenticate } from "../middleware/auth";
import { JWT_SECRET } from "../config/env";
import { pool } from "../config/database";


const router = express.Router();

router.post("/register", async (req,res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email or password are required",
    });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const userId = crypto.randomUUID();

  const result = await pool.query(
    `
      INSERT INTO users (id, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, email, created_at
    `,
    [userId,email,passwordHash]
  );
  res.status(201).json({
    user: result.rows[0],
  })
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