import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { pool } from "../config/database";
import { JWT_SECRET } from "../config/env";
export interface PasswordResetRequest {
  email:string;
  resetToken: string
}

export async function login(
  email:string,
  password:string
) {
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

export async function requestPasswordReset(
  email:string
):Promise<PasswordResetRequest | null> {

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

export async function resetPassword(
  resetToken:string,
  newPassword:string
):Promise<boolean> {

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