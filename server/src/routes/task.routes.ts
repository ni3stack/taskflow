import { Router } from "express"
import { validate } from "../middleware/validate.middleware";
import { authenticate } from "../middleware/auth.middleware";
import { createTaskSchema, taskIdSchema, updateTaskSchema } from "../validators/task.validator";
import { createTask, deleteTask, getTasks, getTasksById, updateTask } from "../controllers/task.controller";
import { apiRateLimiter } from "../middleware/rateLimiter.middleware";


const router = Router();

router.use(authenticate, apiRateLimiter);


router.post(
  "/",
  validate(createTaskSchema),
  createTask
);

router.get("/", getTasks);

router.get(
  "/:id", 
  validate(taskIdSchema, "params"),
  getTasksById
);

router.patch(
  "/:id",
  validate(taskIdSchema, "params"),
  validate(updateTaskSchema),
  updateTask
);

router.delete(
  "/:id",
  validate(taskIdSchema, "params"),
  deleteTask
);


export default router;
