import express from "express";
import cors from "cors";

import authRouter from "./routes/auth.routes";
// import projectRouter from "./routes/project.routes";

import { errorHandler } from "./middleware/error.middleware";

const app = express();

app.use(
  cors({
    origin: [
      "http://taskflow.test:5173",
      "http://ni3.playground.test:5174",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-type", "Authorization"],
    maxAge: 0,
  })
);

app.use(express.json());

app.get("api/health", (_req,res) => {
  res.json({
    status: "ok",
    message: "Taskflow api is running",
  })
});

app.use("/api/auth", authRouter);
// app.use("/api/projects", projectRouter);

app.use(errorHandler);

export default app;