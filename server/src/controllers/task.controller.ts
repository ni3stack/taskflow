import { Request, Response } from "express"
import { asyncHandler } from "../utils/asyncHandler"
import {
  createTask as createTaskService,
  getTasks as getTasksService,
  getTasksById as getTasksByIdService,
  getTasksByProjectId as getTasksByProjectService,
  updateTask as updateTaskService,
  deleteTask as deleteTaskService
} from "../services/task.service";

export const createTask = asyncHandler(async(
  req: Request,
  res: Response,
) => {

  if(!req.user) {
    return res.status(401).json({
      message: "Authentication required",
    })
  }
  const {
    projectId,
    title,
    description,
    status,
    priority,
    dueDate
  } = req.body

  const userId = req.user?.userId;

  const task = await createTaskService(
    userId,
    projectId,
    title,
    description,
    status,
    priority,
    dueDate
  );

  if (!task) {
    return res.status(404).json({
      message: "Project not found",
    });
  }
  return res.status(201).json(task);
});

export const getTasks = asyncHandler(async(
  req: Request,
  res: Response
) => {

  if(!req.user) {
    return res.status(401).json({
      message: "Authentication required",
    })
  }
  const userId = req.user?.userId;
  const tasks = await getTasksService(userId)
  return res.status(200).json({
    tasks,
  });
});

export const getTasksById = asyncHandler(
  async (req: Request, res: Response) => {
    if(!req.user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }
    const { id } = req.params;
    if (typeof id !== "string") {
      return res.status(400).json({
        message: "Invalid task ID",
      });
    }
    const task = await getTasksByIdService(
      id,
      req.user?.userId,
    );

    if(!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }
    return res.status(200).json(task);
}
);

export const getTasksByProject = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const { projectId } = req.params;

    if (typeof projectId !== "string") {
      return res.status(400).json({
        message: "Invalid project ID",
      });
    }

    const tasks = await getTasksByProjectService(
      projectId,
      req.user.userId
    );

    return res.status(200).json({
      tasks,
    });
  }
);

export const updateTask = asyncHandler(
  async(req:Request, res:Response) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const { id } = req.params;

    if (typeof id !== "string") {
      return res.status(400).json({
        message: "Invalid task ID",
      });
    }

    const task = await updateTaskService(
      id,
      req.user?.userId,
      req.body
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }
    
    return res.status(200).json({
      task,
    });
  }
);

export const deleteTask = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const { id } = req.params;

    if (typeof id !== "string") {
      return res.status(400).json({
        message: "Invalid task ID",
      });
    }

    const task = await deleteTaskService(
      id,
      req.user.userId
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    return res.status(204).send();
  }
);
