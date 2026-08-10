import express from "express";
import cors from "cors"
import authRouter from "./routes/auth";
import { PORT } from "./config/env";

const app = express();

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