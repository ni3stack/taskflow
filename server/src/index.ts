import express from "express";
import cors from "cors"
import authRouter from "./routes/auth.routes";
import { PORT } from "./config/env";
import { pool } from "./config/database";

const app = express();

pool.query("SELECT 1")
    .then(() => {
        console.log("database connected");
    })
    .catch((error) => {
        console.error("database connection failed", error);
    });

app.use(cors({
    origin: [
        "http://taskflow.test:5173",
        "http://ni3.playground.test:5174",
        ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-type","Authorization"],
    maxAge: 0,
}));
app.use(express.json());

app.get("/api/health", (_req, res) => {
    res.json({
        status: "ok",
        message: "TaskFlow api is running",
    })
});

app.use("/api/auth", authRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});