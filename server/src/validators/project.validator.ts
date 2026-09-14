import { z } from "zod"

export const createProjectSchema = z.
  object({
    name: z
      .string()
      .trim()
      .min(1, "Project name is required")
      .max(150, "Project name must not exceed 150 characters"),

    description: z
      .string()
      .optional()
});

export const updateProjectSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Project name is required")
      .max(150, "Project name must not exceed 150 characters")
      .optional(),

    description: z
      .string()
      .max(1000, "Project Description must not exceed 1000 characters")
      .optional()
  })
  .refine(
    (data) => data.name !== undefined || data.description !== undefined,
    {
      message: "At least one field is required",
    }
  )

export const projectIdSchema = z.object({
  id: z.uuid("Invalid project ID"),
});

