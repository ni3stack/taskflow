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

const router = Router();

router.post(
  "/", 
  authenticate, 
  validate(createProjectSchema),
  createProject
);

router.get("/", authenticate, getProjects);

router.get(
  "/:id", 
  authenticate,
  validate(projectIdSchema, "params"),
  getProjectById
);

router.patch(
  "/:id",
  authenticate,
  validate(projectIdSchema, "params"),
  validate(updateProjectSchema),
  updateProject
);

router.delete(
  "/:id",
  authenticate,
  validate(projectIdSchema, "params"),
  deleteProject
);


export default router;