import dotenv from "dotenv"
dotenv.config();

if (!process.env.JWT_SECRET) {
    throw new Error("Secret is not configured");
}

export const JWT_SECRET = process.env.JWT_SECRET as string;
export const PORT = process.env.PORT || 5000;

