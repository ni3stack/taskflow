import { pool } from "../../src/config/database";

export const addProjectMember = async (
  workspaceId: string,
  projectId: string,
  userId: string,
  projectRole: "manager" | "contributor"
) => {
  await pool.query(
    `
      INSERT INTO workspace_members (workspace_id, user_id, role)
      VALUES ($1, $2, 'member')
      ON CONFLICT (workspace_id, user_id) DO NOTHING
    `,
    [workspaceId, userId]
  );
  await pool.query(
    `
      INSERT INTO project_members (project_id, workspace_id, user_id, role)
      VALUES ($1, $2, $3, $4)
    `,
    [projectId, workspaceId, userId, projectRole]
  );
};

export const addWorkspaceAdmin = async (workspaceId: string, userId: string) => {
  await pool.query(
    `
      INSERT INTO workspace_members (workspace_id, user_id, role)
      VALUES ($1, $2, 'admin')
    `,
    [workspaceId, userId]
  );
};

export const addWorkspaceMember = async (
  workspaceId: string,
  userId: string
) => {
  await pool.query(
    `
      INSERT INTO workspace_members (workspace_id, user_id, role)
      VALUES ($1, $2, 'member')
    `,
    [workspaceId, userId]
  );
};

export const removeProjectMember = async (
  projectId: string,
  userId: string
) => {
  await pool.query(
    `
      DELETE FROM project_members
      WHERE project_id = $1 AND user_id = $2
    `,
    [projectId, userId]
  );
};