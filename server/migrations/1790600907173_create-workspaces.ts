import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('workspaces', {
    id: {
      type: 'uuid',
      primaryKey: true,
    },
    name: {
      type: 'varchar(150)',
      notNull: true,
    },
    description: {
      type: 'text',
    },
    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('now()'),
    },
    updated_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('now()'),
    },
  });

  pgm.createTable('workspace_members', {
    workspace_id: {
      type: 'uuid',
      notNull: true,
      references: 'workspaces(id)',
      onDelete: 'CASCADE',
    },
    user_id: {
      type: 'uuid',
      notNull: true,
      references: 'users(id)',
      onDelete: 'RESTRICT',
    },
    role: {
      type: 'varchar(20)',
      notNull: true,
      default: 'member',
    },
    joined_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('now()'),
    },
  });

  pgm.addConstraint('workspace_members', 'workspace_members_pkey', {
    primaryKey: ['workspace_id', 'user_id'],
  });

  pgm.addConstraint('workspace_members', 'workspace_members_role_check', {
    check: "role IN ('owner', 'admin', 'member')",
  });

  pgm.createIndex('workspace_members', 'user_id');
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('workspace_members');
  pgm.dropTable('workspaces');
}