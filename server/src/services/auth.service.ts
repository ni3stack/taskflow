import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { pool } from "../config/database";
import { JWT_SECRET } from "../config/env";

export interface PasswordResetRequest {
  email:string;
  resetToken: string
}

type passwordResetType = Promise<PasswordResetRequest | null>;

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  const passwordHash = await bcrypt.hash(password, 10);
  const userId = crypto.randomUUID();

  const result = pool.query(
    `
     INSERT INTO users 
     (id, name, email, password_hash)
     VALUES ($1, $2, $3, $4)
     RETURNING id, email, created_at
    `,
    [userId, name, email, passwordHash]
  );

  return (await result).rows[0];
};


export const loginUser = async ( 
  email:string,
  password:string
) => {
   const result = await pool.query(
    `
      SELECT id, email, password_hash
      FROM users
      WHERE email = $1
    `,
    [email]
  );

  if(result?.rows.length === 0) {
    return null;
  }
  
  const user = result.rows[0];
  
   const passwordMatches = await bcrypt.compare(
    password,
    user.password_hash
  );

  if (!passwordMatches) {
    return null;
  }

  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  return {
    token,
  };
}

export const getUserById = async (
  userId:string
) => {
  const result = await pool.query(
    `
      SELECT id, name, email, created_at
      FROM users 
      WHERE id = $1
    `,
    [userId]
  );
  return result.rows[0] ?? null;
}

export const requestPasswordReset = async (
  email:string
):passwordResetType => {

  const userResult = await pool.query(
    `
      SELECT id from users
      WHERE email = $1
    `,
    [email]
  );

  if(userResult.rows.length === 0) {
    return null;
  }

  const userId = userResult.rows[0].id;

  const resetToken = crypto.randomBytes(32).toString("hex");

  console.log("GENERATED RESET TOKEN - ", resetToken);

  const tokenHash = crypto.createHash("sha256")
    .update(resetToken)
    .digest("hex");
  
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000)

  await pool.query(
    `
      INSERT INTO password_reset_tokens
      (id, user_id, token_hash,expires_at) 
      VALUES
      ($1,$2,$3,$4)
    `,
    [
      crypto.randomUUID(),
      userId,
      tokenHash,
      expiresAt
    ]
  );

  return {
    email,
    resetToken
  }
}

export const resetPassword = async (
  resetToken:string,
  newPassword:string
):Promise<boolean> => {

  const tokenHash = crypto.createHash("sha256")
    .update(resetToken)
    .digest("hex");

  console.log("token -", tokenHash);

  const tokenResult = await pool.query(
    `SELECT id, user_id, expires_at
     FROM password_reset_tokens
    WHERE token_hash = $1 
    `,
    [tokenHash]
  );

  if(tokenResult.rows.length === 0) {
    console.log("token not found")
    return false;
  }

  const resetRecord = tokenResult.rows[0];

  if(new Date(resetRecord.expires_at) < new Date()) {
    console.log("Link expired");
    return false;
  }

  const passwordHash = await bcrypt.hash(newPassword,10);

  await pool.query(
    `UPDATE users 
      SET password_hash = $1,
      password_changed_at = now()
      WHERE id = $2
    `,
    [passwordHash, resetRecord.user_id]
  );

  await pool.query(
    `
    DELETE from password_reset_tokens
    WHERE id = $1
    `,
    [resetRecord.id]
  );

  return true;
}