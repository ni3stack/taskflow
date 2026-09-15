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
  projectIdSchema, 
  updateProjectSchema 
} from "../validators/project.validator";
import { apiRateLimiter } from "../middleware/rateLimiter.middleware";

const router = Router();

router.use(apiRateLimiter, authenticate);

router.post(
  "/", 
  validate(createProjectSchema),
  createProject
);

router.get("/", getProjects);

router.get(
  "/:id", 
  validate(projectIdSchema, "params"),
  getProjectById
);

router.patch(
  "/:id",
  validate(projectIdSchema, "params"),
  validate(updateProjectSchema),
  updateProject
);

router.delete(
  "/:id",
  validate(projectIdSchema, "params"),
  deleteProject
);

export default router;