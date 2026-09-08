import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('tasks', {
    id: {
      type: 'uuid',
      primaryKey: true,
    },
    user_id: {
      type: 'uuid',
      notNull: true,
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
    project_id: {
      type: 'uuid',
      notNull: true,
      references: 'projects(id)',
      onDelete: 'CASCADE',
    },
    title: {
      type: 'varchar(200)',
      notNull: true,
    },
    description: {
      type: 'text',
    },
    status: {
      type: 'varchar(30)',
      notNull: true,
      default: 'todo',
    },
    priority: {
      type: 'varchar(30)',
      notNull: true,
      default: 'medium',
    },
    due_date: {
      type: 'timestamptz',
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

  pgm.createIndex('tasks', 'user_id');
  pgm.createIndex('tasks', 'project_id');
  pgm.createIndex('tasks', 'status');

  pgm.addConstraint('tasks', 'tasks_status_check', {
    check: "status IN ('todo', 'in_progress', 'completed')",
  });

  pgm.addConstraint('tasks', 'tasks_priority_check', {
    check: "priority IN ('low', 'medium', 'high')",
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('tasks');
}