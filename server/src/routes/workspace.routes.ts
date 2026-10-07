import { Router } from "express";
import { apiRateLimiter } from "../middleware/rateLimiter.middleware";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { 
  createWorkspacesSchema, 
  workspaceIdSchema
} from "../validators/workspace.validator";
import { 
  createWorkspace, 
  getWorkspaceById, 
  getWorkspaces
} from "../controllers/workspace.controller";

import { getWorkspaceTasks } from "../controllers/task.controller";


const router = Router();

router.use(apiRateLimiter, authenticate);

router.post(
  "/",
  validate(createWorkspacesSchema),
  createWorkspace
);

router.get("/", getWorkspaces);

router.get(
  "/:workspaceId",
  validate(workspaceIdSchema, "params"),
  getWorkspaceById
);

router.get(
  "/:workspaceId/tasks",
  validate(workspaceIdSchema, "params"),
  getWorkspaceTasks
);

export default router;
