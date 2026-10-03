import type { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  // Existing projects and tasks are disposable development data.
  pgm.sql(`
    DELETE FROM tasks;
    DELETE FROM projects;
  `);

  // Each project belongs to one workspace.
  pgm.addColumn("projects", {
    workspace_id: {
      type: "uuid",
      notNull: true,
      references: "workspaces(id)",
      onDelete: "RESTRICT",
    },
  });

  pgm.createIndex("projects", "workspace_id");

  // Preserve the creator separately from project permissions.
  pgm.renameColumn("projects", "user_id", "created_by");

  // Assumes the default constraint name from the original migration.
  pgm.dropConstraint("projects", "projects_user_id_fkey");

  pgm.addConstraint("projects", "projects_created_by_fkey", {
    foreignKeys: {
      columns: "created_by",
      references: "users(id)",
      onDelete: "RESTRICT",
    },
  });

  // Supports the composite foreign key from project_members.
  pgm.addConstraint("projects", "projects_id_workspace_id_key", {
    unique: ["id", "workspace_id"],
  });

  pgm.createTable("project_members", {
    project_id: {
      type: "uuid",
      notNull: true,
    },
    workspace_id: {
      type: "uuid",
      notNull: true,
    },
    user_id: {
      type: "uuid",
      notNull: true,
    },
    role: {
      type: "varchar(20)",
      notNull: true,
      default: "contributor",
    },
    joined_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
  });

  pgm.addConstraint("project_members", "project_members_pkey", {
    primaryKey: ["project_id", "user_id"],
  });

  pgm.addConstraint("project_members", "project_members_role_check", {
    check: "role IN ('manager', 'contributor')",
  });

  // The project must belong to the specified workspace.
  pgm.addConstraint("project_members", "project_members_project_fkey", {
    foreignKeys: {
      columns: ["project_id", "workspace_id"],
      references: "projects(id, workspace_id)",
      onDelete: "CASCADE",
    },
  });

  // The user must be a member of that same workspace.
  pgm.addConstraint(
    "project_members",
    "project_members_workspace_member_fkey",
    {
      foreignKeys: {
        columns: ["workspace_id", "user_id"],
        references: "workspace_members(workspace_id, user_id)",
        onDelete: "CASCADE",
      },
    }
  );

  pgm.createIndex("project_members", ["workspace_id", "user_id"]);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  // Remove dependent membership records and constraints first.
  pgm.dropTable("project_members");

  pgm.dropConstraint("projects", "projects_id_workspace_id_key");
  pgm.dropConstraint("projects", "projects_created_by_fkey");

  pgm.renameColumn("projects", "created_by", "user_id");

  pgm.addConstraint("projects", "projects_user_id_fkey", {
    foreignKeys: {
      columns: "user_id",
      references: "users(id)",
      onDelete: "CASCADE",
    },
  });

  pgm.dropIndex("projects", "workspace_id");
  pgm.dropColumn("projects", "workspace_id");
}