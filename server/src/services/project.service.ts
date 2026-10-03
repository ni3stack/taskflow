import crypto from "crypto";
import { pool } from "../config/database";

export const createProject = async(
  workspaceId: string,
  userId:string,
  name:string,
  description?:string
) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const memberSql = `
      SELECT user_id
      FROM workspace_members
      WHERE workspace_id = $1 AND user_id = $2
      FOR KEY SHARE
    `;

    const membershipResult = await client.query(memberSql, [workspaceId, userId]);

    if (membershipResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return null;
    }
  
    const result = await client.query(
      `
        INSERT INTO projects
          (id, workspace_id, created_by, name, description)
        VALUES
          ($1, $2, $3, $4, $5)
        RETURNING
          id,
          workspace_id,
          created_by,
          name,
          description,
          created_at,
          updated_at
      `,
      [
        crypto.randomUUID(),
        workspaceId,
        userId,
        name,
        description ?? null,
      ]
    );
    const projects = result.rows[0];

    await client.query(
      `
        INSERT INTO project_members
          (project_id, workspace_id, user_id, role)
        VALUES
          ($1, $2, $3, $4)
      `,
      [projects.id, workspaceId, userId, "manager"]
    );

    await client.query("COMMIT");
    return projects;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export const getProjects = async (
  workspaceId:string,
  userId:string
) => {
  const membershipResult = await pool.query(
    `
      SELECT user_id
      FROM workspace_members
      WHERE workspace_id = $1 AND user_id = $2
      FOR KEY SHARE
    `,
    [workspaceId, userId]
  );

  if (membershipResult.rows.length === 0) {
    return null;
  }
  const result =  await pool.query(
    `
    SELECT
      p.id,
      p.workspace_id,
      p.created_by,
      p.name,
      p.description,
      p.created_at,
      p.updated_at
    FROM projects p
    INNER JOIN workspace_members wm 
    ON wm.workspace_id = p.workspace_id 
    AND wm.user_id = $2
    WHERE p.workspace_id = $1
    ORDER BY p.created_at DESC, p.id DESC
    `,
    [workspaceId, userId]
  );
  return result.rows;
};

export const getProjectById = async(
  workspaceId:string,
  projectId:string, 
  userId:string
) => {
  const result = await pool.query(
    `
    SELECT
      p.id,
      p.created_by,
      p.name,
      p.description,
      p.created_at,
      p.updated_at
    FROM projects p
    INNER JOIN workspace_members wm
    ON wm.workspace_id = p.workspace_id
    WHERE p.workspace_id = $1
    AND p.id = $2
    AND wm.user_id =$3
    `,
    [workspaceId, projectId, userId]
  );

  return result.rows[0] ?? null;
};

export const updateProject = async(
  workspaceId:string,
  projectId:string,
  userId:string,
  name?:string,
  description?:string
) => {

  const result = await pool.query(
    `
      UPDATE projects AS p
      SET
        name = COALESCE($4, name),
        description = COALESCE($5, description),
        updated_at = now()
      WHERE p.workspace_id=$1
        AND p.id=$2
        AND EXISTS (
          SELECT 1
          FROM project_members pm
          WHERE pm.project_id = p.id
            AND pm.workspace_id = p.workspace_id
            AND pm.user_id = $3
            AND pm.role = 'manager'
        )
      RETURNING
        p.id,
        p.workspace_id,
        p.created_by,
        p.name,
        p.description,
        p.created_at,
        p.updated_at
    `,
    [workspaceId, projectId, userId, name, description]
  );

  return result.rows[0] ?? null;
};

export const deleteProject = async(
  workspaceId:string,
  projectId: string,
  userId: string
) => {
  const result = await pool.query(
    `
      DELETE FROM projects AS p
      WHERE p.workspace_id = $1 
        AND p.id = $2
        AND EXISTS (
          SELECT 1
          FROM project_members pm
          WHERE pm.project_id = p.id
            AND pm.workspace_id = p.workspace_id
            AND pm.user_id = $3
            AND pm.role = 'manager'
        )
        RETURNING p.id
    `,
    [workspaceId, projectId, userId]
  );

  return result.rows[0] ?? null;
};
