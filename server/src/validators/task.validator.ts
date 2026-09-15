import { z } from "zod";

export const taskIdSchema = z.object({
  id: z.uuid("Invalid task ID"),
});

export const projectIdSchema = z.object({
  projectId: z.uuid("Invalid project ID"),
});

export const createTaskSchema = z.object({
  projectId: z.string().uuid("Invalid project ID"),

  title: z
    .string()
    .trim()
    .min(1, "Task title is required")
    .max(200, "Task title must not exceed 200 characters"),

  description: z
    .string()
    .max(1000, "Description must not exceed 1000 characters")
    .optional(),

  status: z
    .enum(["todo", "in_progress", "completed"])
    .optional(),

  priority: z
    .enum(["low", "medium", "high"])
    .optional(),

  dueDate: z
    .string()
    .datetime()
    .optional(),
});

export const updateTaskSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Task title is required")
      .max(200, "Task title must not exceed 200 characters")
      .optional(),

    description: z
      .string()
      .max(1000, "Description must not exceed 1000 characters")
      .nullable()
      .optional(),

    status: z
      .enum(["todo", "in_progress", "completed"])
      .optional(),

    priority: z
      .enum(["low", "medium", "high"])
      .optional(),

    dueDate: z
      .string()
      .datetime()
      .nullable()
      .optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "At least one field is required",
    }
);