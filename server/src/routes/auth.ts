import express from "express";
import jwt from "jsonwebtoken";
import { authenticate } from "../middleware/auth";
import { JWT_SECRET } from "../config/env";


const router = express.Router();

const TEST_USER = {
    id: "user-1",
    email: "test@taskflow.com",
    password: "password@#12#$"
};

router.post("/login", (req,res) => {
  const { email, password } = req.body;

  if(email != TEST_USER.email || password != TEST_USER.password) {
    return res.status(401).json({
        message: "Invalid email or password"
    })
  }
  const token = jwt.sign(
    {
        userId: TEST_USER.id,
        email: TEST_USER.password
    },
    JWT_SECRET,
    {
        expiresIn: "1h"
    }
  );
  res.json({
    token,
  })
});

router.get("/me", authenticate, (req, res) => {
  res.json({
    user: req.user
  })
});

export default router