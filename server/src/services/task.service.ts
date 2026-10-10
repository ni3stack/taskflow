import crypto from "crypto";
import { pool } from "../config/database";

export const createTask = async (
  userId: string,
  projectId: string,
  title: string,
  description?: string,
  status = "todo",
  priority = "medium",
  dueDate?: string
) => {
  const result = await pool.query(
    `
      INSERT INTO tasks (
        id,
        user_id,
        project_id,
        title,
        description,
        status,
        priority,
        due_date
      )
      SELECT
        $1, $2, p.id, $4, $5, $6, $7, $8
      FROM projects p
      INNER JOIN project_members pm
        ON pm.project_id = p.id
        AND pm.workspace_id = p.workspace_id
      WHERE p.id = $3
        AND pm.user_id = $2
        AND pm.role IN ('manager', 'contributor')
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
      crypto.randomUUID(),
      userId,
      projectId,
      title,
      description ?? null,
      status,
      priority,
      dueDate ?? null,
    ]
  );

  return result.rows[0] ?? null;
};

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
  const access = await pool.query(
    `
      SELECT p.id
      FROM projects p
      INNER JOIN workspace_members wm
        ON wm.workspace_id = p.workspace_id
        AND wm.user_id = $2
      WHERE p.id = $1
        AND (
          wm.role IN ('owner', 'admin')
          OR EXISTS (
            SELECT 1
            FROM project_members pm
            WHERE pm.project_id = p.id
              AND pm.workspace_id = p.workspace_id
              AND pm.user_id = $2
          )
        )
    `,
    [projectId, userId]
  );

  if (access.rows.length === 0) {
    return null;
  }
  const result = await pool.query(
      `
        SELECT
          t.id,
          t.user_id,
          t.project_id,
          t.title,
          t.description,
          t.status,
          t.priority,
          t.due_date,
          t.created_at,
          t.updated_at
        FROM tasks t
        INNER JOIN projects p
          ON p.id = t.project_id
        INNER JOIN workspace_members wm
          ON wm.workspace_id = p.workspace_id
        WHERE p.id = $1
          AND wm.user_id = $2
        ORDER BY t.created_at DESC, t.id DESC
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


// Workspace related services

export const getWorkspaceTasks = async (
  workspaceId: string,
  userId: string
) => {
  const membership = await pool.query(
    `
      SELECT user_id
      FROM workspace_members
      WHERE workspace_id = $1
        AND user_id = $2
    `,
    [workspaceId, userId]
  );

  if (!membership.rows[0]) {
    return null;
  }

  const result = await pool.query(
    `
      SELECT
        t.id,
        t.project_id,
        p.name AS project_name,
        t.title,
        t.description,
        t.status,
        t.priority,
        t.due_date,
        t.created_at,
        t.updated_at
      FROM tasks t
      INNER JOIN projects p ON p.id = t.project_id
      INNER JOIN workspace_members wm ON wm.workspace_id = p.workspace_id
      WHERE p.workspace_id = $1
        AND wm.user_id = $2
      ORDER BY t.created_at DESC, t.id DESC
    `,
    [workspaceId, userId]
  );

  return result.rows;
}