import { Request, Response } from "express";
import { 
  createWorkspace as createWorkspaceService,
  getWorkspaces as getWorkspacesService,
  getWorkspaceById as getWorkspaceByIdService
} from "../services/workspace.service";

import { asyncHandler } from "../utils/asyncHandler";

export const createWorkspace = asyncHandler(async (
  req: Request,
  res: Response
) => {

  if(!req.user) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  const { name, description } = req.body;

  const workspace = await createWorkspaceService(
    req.user.userId,
    name,
    description
  );

  return res.status(201).json(workspace);
});

export const getWorkspaces = asyncHandler(async(
  req: Request,
  res: Response
) => {
  if(!req.user) {
    return res.status(401).json({
      message: "Authentication required",
    })
  }

  const workspaces = await getWorkspacesService(req.user.userId);

  return res.status(200).json(workspaces);
});

export const getWorkspaceById = asyncHandler(async(
  req: Request,
  res: Response
) => {
  if(!req.user) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }
  const { workspaceId } = req.params;

  if(typeof workspaceId !== "string") {
    return res.status(400).json({
       message: "Invalid workspace ID",
    })
  }
  const workspaces = await getWorkspaceByIdService(workspaceId, req.user.userId);

  if(!workspaces) {
    return res.status(404).json({
      message: "Workspace not found",
    });
  }

  return res.status(200).json(workspaces);
});