import { z } from "zod";

export const createWorkspacesSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1,"Workspace name is required")
    .max(150, "Workspace name must not exceed 150 characters"),

  description: z
    .string()
    .trim()
    .max(1000, "Workspace description must not exceed 1000 characters")
    .optional(),
});

export const workspaceIdSchema = z.object({
  workspaceId: z.uuid("Invalid workspace ID"),
});