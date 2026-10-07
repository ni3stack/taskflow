import { Router } from "express"
import { 
  createProject, 
  deleteProject, 
  getProjectById, 
  getProjects, 
  updateProject 
} from "../controllers/project.controller"
import { authenticate } from "../middleware/auth.middleware"
import { validate } from "../middleware/validate.middleware";
import { 
  createProjectSchema, 
  updateProjectSchema, 
  workspaceProjectParamsSchema
} from "../validators/project.validator";
import { apiRateLimiter } from "../middleware/rateLimiter.middleware";
import { workspaceIdSchema } from "../validators/workspace.validator";

const router = Router({ mergeParams: true });

router.use(apiRateLimiter, authenticate);

router.post(
  "/",
  validate(workspaceIdSchema, "params"),
  validate(createProjectSchema),
  createProject
);

router.get("/", 
  validate(workspaceIdSchema, "params"),  
  getProjects
);

router.get(
  "/:id", 
  validate(workspaceProjectParamsSchema, "params"),
  getProjectById
);

router.patch(
  "/:id",
  validate(workspaceProjectParamsSchema, "params"),
  validate(updateProjectSchema),
  updateProject
);

router.delete(
  "/:id",
  validate(workspaceProjectParamsSchema, "params"),
  deleteProject
);

export default router;
