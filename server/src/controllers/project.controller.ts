import { Request, Response } from "express";
import { 
  createProject as createProjectService,
  getProjects as getProjectService,
  getProjectById as getProjectByIdService,
  updateProject as updateProjectService,
  deleteProject as deleteProjectService
} from "../services/project.service";
import { asyncHandler } from "../utils/asyncHandler";

export const createProject = asyncHandler(async (
  req: Request,
  res: Response
) => {

  if(!req.user) {
    return res.status(401).json({
      message: "Authentication required",
    })
  }
  const { name, description } = req.body;

  const project = await createProjectService(
    req.user.userId,
    name,
    description
  );
  return res.status(201).json(project);
});

export const getProjects = asyncHandler(async (
  req: Request,
  res: Response
) => {

  if(!req.user) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }
  const { userId } = req.user;

  const projects = await getProjectService(userId);
  return res.status(200).json(projects);
});

export const getProjectById = asyncHandler(async (
  req:Request, 
  res:Response
) => {

  if(!req.user) {
    return res.status(401).json({
      message: "Authentication required"
    });
  }
  const { id } = req.params;

  if (typeof id !== "string") {
    return res.status(400).json({
      message: "Invalid project ID",
    });
  }

  const project = await getProjectByIdService(id,req.user.userId);

  if(!project) {
    return res.status(404).json({
      message: "Project not found"
    });
  }
  return res.status(200).json(project);
});

export const updateProject = asyncHandler(async(
  req: Request,
  res: Response
) => {

  if(!req.user) {
    return res.status(401).json({
      message: "Authentication required"
    });
  }

  const { id } = req.params;

  if (typeof id !== "string") {
    return res.status(400).json({
      message: "Invalid project ID",
    });
  }

  const { name, description } = req.body;

  const project = await updateProjectService(
    id,
    req.user.userId,
    name,
    description
  );

  if(!project) {
    return res.status(404).json({
      message: "Project not found"
    });
  }

  return res.status(200).json(project);
});

export const deleteProject = asyncHandler(async (
  req:Request,
  res: Response
) => {
  
  if(!req.user) {
    return res.status(401).json({
      message: "Authentication required"
    })
  }

  const { id } = req.params;

  if(typeof id !== "string") {
    return res.status(400).json({
      message: "Invalid project ID"
    })
  }

  const deletedProjectId = await deleteProjectService(id,req.user.userId);

  
  if (!deletedProjectId) {
    return res.status(404).json({
      message: "Project not found",
    });
  }

  return res.status(204).send();

});