import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware";
import { apiRateLimiter } from "../middleware/rateLimiter.middleware";
import { validate } from "../middleware/validate.middleware";

import {
  getTasksByProject,
} from "../controllers/task.controller";

import {
  projectIdSchema,
} from "../validators/task.validator";

const router = Router({ mergeParams: true });

router.use(authenticate, apiRateLimiter);

router.get(
  "/",
  validate(projectIdSchema, "params"),
  getTasksByProject
);

export default router;
