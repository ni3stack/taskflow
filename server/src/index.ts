import express from "express";
import cors from "cors"
import authRouter from "./routes/auth";
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

app.use(cors());
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