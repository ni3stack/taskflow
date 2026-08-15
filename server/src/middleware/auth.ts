import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthUser } from "../types/auth.types";
import { JWT_SECRET } from "../config/env";

export const authenticate = (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    const authHeader = req.headers.authorization;
    if(!authHeader) {
        return res.status(401).json({
            message: "Authentication required",
        })
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
        req.user = decoded;
        next();
    } catch {
        return res.status(401).json({
            message: "Invalid or expired token",
        })
    }
}