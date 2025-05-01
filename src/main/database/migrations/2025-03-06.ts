/* eslint-disable @typescript-eslint/no-explicit-any */
import { Kysely, sql, Migration } from 'kysely'

// @ts-ignore
import colors from 'tailwindcss/colors'

const description = 'database initial setup'

async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('habit')
    .ifNotExists()
    .addColumn('id', 'text', (column) => column.primaryKey())
    .addColumn('name', 'text', (column) => column.notNull())
    .addColumn('description', 'text', (column) => column.defaultTo(''))
    .addColumn('badge', 'text', (column) => column.defaultTo('💪').notNull())
    .addColumn('color', 'text', (column) => column.defaultTo(colors.blue[500]).notNull())
    .addColumn('frequency', 'json', (column) => column.notNull())
    .addColumn('streak', 'integer', (column) => column.defaultTo(0).notNull())
    .addColumn('created_at', 'timestamp', (column) =>
      column.notNull().defaultTo(sql`CURRENT_TIMESTAMP`)
    )
    .execute()

  await db.schema
    .createTable('task')
    .ifNotExists()
    .addColumn('id', 'text', (column) => column.primaryKey())
    .addColumn('name', 'text', (column) => column.notNull())
    .addColumn('description', 'text')
    .addColumn('is_completed', 'boolean', (column) => column.defaultTo(false).notNull())
    .addColumn('habit_id', 'text', (column) =>
      column.notNull().references('habit.id').onDelete('cascade')
    )
    .addColumn('created_at', 'timestamp', (column) =>
      column.notNull().defaultTo(sql`CURRENT_TIMESTAMP`)
    )
    .execute()

  await db.schema
    .createTable('journal')
    .ifNotExists()
    .addColumn('id', 'text', (column) => column.primaryKey())
    .addColumn('title', 'text', (column) => column.notNull())
    .addColumn('content', 'json')
    .addColumn('habit_id', 'text', (column) =>
      column.notNull().references('person.id').onDelete('cascade')
    )
    .addColumn('created_at', 'timestamp', (column) =>
      column.notNull().defaultTo(sql`CURRENT_TIMESTAMP`)
    )
    .execute()

  console.info(`🪶 migration description: **${description}**`)
}

async function down(db: Kysely<any>): Promise<void> {
  console.info(`🪶 migration description: **${description}**`)

  await db.schema.dropTable('habit').ifExists().execute()
  await db.schema.dropTable('task').ifExists().execute()
  await db.schema.dropTable('journal').ifExists().execute()
}

export const Migration20250306: Migration = { up, down }
