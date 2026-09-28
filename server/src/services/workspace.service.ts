import crypto from "crypto";
import { pool } from "../config/database";

export const createWorkspace = async(
  userId: string,
  name: string,
  description?: string
) => {
  
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await client.query(
      `
        INSERT INTO workspaces
          (id, name, description)  
        VALUES
          ($1, $2, $3)
        RETURNING
          id,
          name,
          description,
          created_at,
          updated_at
      `,
      [crypto.randomUUID(),name, description ?? null ]
    );

    const workspace = result.rows[0];

    await client.query(
      `
        INSERT INTO workspace_members
          (workspace_id, user_id, role)
        VALUES
          ($1, $2, $3)
      `, 
      [workspace.id, userId, "owner"]
    );

    await client.query("COMMIT");

    return { ...workspace, role: "owner"};

  } catch(error) {

    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export const getWorkspaces = async(userId:string) => {
  const result = await pool.query(
    `
      SELECT
        w.id,
        w.name,
        w.description,
        w.created_at,
        w.updated_at,
        wm.role
      FROM workspaces w
      INNER JOIN workspace_members wm
       ON wm.workspace_id = w.id
      WHERE wm.user_id = $1
      ORDER BY w.created_at DESC, w.id DESC
    `,
    [userId]
  );

  return result.rows;
}

export const getWorkspaceById = async(
  workspaceId: string,
  userId: string
) => {
  const result = await pool.query(
    `
      SELECT
        w.id,
        w.name,
        w.description,
        w.created_at,
        w.updated_at,
        wm.role
      FROM workspaces w
      INNER JOIN workspace_members wm
        on wm.workspace_id = w.id
      WHERE w.id = $1
      AND wm.user_id = $2
    `,
    [workspaceId, userId]
  );

  return result.rows[0] ?? null;
}

