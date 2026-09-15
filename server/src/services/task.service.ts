import crypto from "crypto";
import { pool } from "../config/database";

export const createTask = async(
  userId: string,
  projectId: string,
  title: string,
  description?: string,
  status = "todo",
  priority = "medium",
  dueDate?: string
) => {
  // First verify the project belongs to this user

  const projectResult = await pool.query(
    `
      SELECT id
      FROM projects
      WHERE id = $1
      AND user_id = $2
    `,
    [projectId, userId]
  );

  if (!projectResult?.rows[0]) {
    return null;
  }

  const taskId = crypto.randomUUID();

  const result = await pool.query(
    `
      INSERT INTO tasks(
        id,
        user_id,
        project_id,
        title,
        description,
        status,
        priority,
        due_date
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING
        id,
        user_id,
        project_id,
        title,
        description,
        status,
        priority,
        due_date,
        created_at,
        updated_at
    `,
    [
      taskId,
      userId,
      projectId,
      title,
      description ?? null,
      status,
      priority,
      dueDate ?? null,
    ]
  );

  return result.rows[0]
}

export const getTasks = async(
  userId:string
) => {

  const results = await pool.query(
    `
      SELECT 
        id,
        user_id,
        project_id,
        title,
        description,
        status,
        priority,
        due_date,
        created_at,
        updated_at
      FROM tasks
      WHERE user_id = $1
      ORDER BY created_at DESC
    `,
    [userId]
  );
  return results.rows;
}

export const getTasksById = async(
  taskId:string,
  userId:string
) => {
  const results = await pool.query(
    `
      SELECT
        id,
        user_id,
        project_id,
        title,
        description,
        status,
        priority,
        due_date,
        created_at,
        updated_at
      FROM tasks
      WHERE id = $1
      AND user_id = $2
    `,
    [taskId,userId]
  );
  return results.rows[0] ?? null;
}

export const getTasksByProjectId = async (
  projectId: string,
  userId: string
) => {
  const result = await pool.query(
    `
      SELECT
        id,
        user_id,
        project_id,
        title,
        description,
        status,
        priority,
        due_date,
        created_at,
        updated_at
      FROM tasks
      WHERE project_id = $1
        AND user_id = $2
      ORDER BY created_at DESC
    `,
    [projectId, userId]
  );

  return result.rows;
};

export const updateTask = async (
  taskId: string,
  userId: string,
  updates: {
    title?: string;
    description?: string | null;
    status?: string;
    priority?: string;
    dueDate?: string | null;
  }
) => {
  const fields: string[] = [];
  const values: unknown[] = [];

  if (updates.title !== undefined) {
    values.push(updates.title);
    fields.push(`title = $${values.length}`);
  }

  if (updates.description !== undefined) {
    values.push(updates.description);
    fields.push(`description = $${values.length}`);
  }

  if (updates.status !== undefined) {
    values.push(updates.status);
    fields.push(`status = $${values.length}`);
  }

  if (updates.priority !== undefined) {
    values.push(updates.priority);
    fields.push(`priority = $${values.length}`);
  }

  if (updates.dueDate !== undefined) {
    values.push(updates.dueDate);
    fields.push(`due_date = $${values.length}`);
  }

  if (fields.length === 0) {
    return null;
  }

  fields.push("updated_at = NOW()");

  values.push(taskId);
  values.push(userId);

  const result = await pool.query(
    `
      UPDATE tasks
      SET ${fields.join(", ")}
      WHERE id = $${values.length - 1}
        AND user_id = $${values.length}
      RETURNING
        id,
        user_id,
        project_id,
        title,
        description,
        status,
        priority,
        due_date,
        created_at,
        updated_at
    `,
    values
  );

  return result.rows[0] ?? null;
};

export const deleteTask = async (
  taskId: string,
  userId: string
) => {
  const result = await pool.query(
    `
      DELETE FROM tasks
      WHERE id = $1
        AND user_id = $2
      RETURNING id
    `,
    [taskId, userId]
  );

  return result.rows[0] ?? null;
};
