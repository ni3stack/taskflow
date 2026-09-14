import crypto from "crypto";
import { pool } from "../config/database";

export const createProject = async(
  userId:string,
  name:string,
  description?:string
) => {
  const result = await pool.query(
    `
      INSERT INTO projects
        (id, user_id, name, description)
      VALUES
        ($1, $2, $3, $4)
      RETURNING
        id,
        user_id,
        name,
        description,
        created_at,
        updated_at
    `,
    [
      crypto.randomUUID(),
      userId,
      name,
      description ?? null,
    ]
  );
  return result.rows[0];
}

export const getProjects = async (userId:string) => {
  const result =  await pool.query(
    `
    SELECT
      id,
      user_id,
      name,
      description,
      created_at,
      updated_at
    FROM projects
    WHERE user_id = $1
    ORDER BY created_at DESC
    `,
    [userId]
  );
  return result.rows;
};

export const getProjectById = async(
  projectId:string, 
  userId:string
) => {
  const result = await pool.query(
    `
    SELECT
      id,
      user_id,
      name,
      description,
      created_at,
      updated_at
    FROM projects
    WHERE id = $1
    AND user_id =$2
    `,
    [projectId, userId]
  );

  return result.rows[0] ?? null;
};

export const updateProject = async(
  projectId:string,
  userId:string,
  name?:string,
  description?:string
) => {

  const result = await pool.query(
    `
      UPDATE projects
      SET
        name = COALESCE($1, name),
        description = COALESCE($2, description),
        updated_at = now()
      WHERE id=$3
        AND user_id=$4
      RETURNING
        id,
        user_id,
        name,
        description,
        created_at,
        updated_at
    `,
    [name, description, projectId, userId]
  );

  return result.rows[0];
};

export const deleteProject = async(
  projectId: string,
  userId: string
) => {
  const result = await pool.query(
    `
      DELETE FROM projects
      WHERE id = $1 AND
      user_id = $2
      RETURNING id
    `,
    [projectId,userId]
  );

  return result.rows[0];
};