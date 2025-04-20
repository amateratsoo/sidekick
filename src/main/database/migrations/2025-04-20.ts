/* eslint-disable @typescript-eslint/no-explicit-any */
import { Kysely, sql, type Migration } from 'kysely'

const description = `
* ⬆️ added the \`task\` table 
`

async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('task')
    .ifNotExists()
    .addColumn('id', 'text', (column) => column.primaryKey().notNull())
    .addColumn('name', 'text', (column) => column.notNull().defaultTo('✏️ Vou fazer isso...'))
    .addColumn('description', 'text', (column) => column.defaultTo(''))
    .addColumn('is_completed', 'boolean', (column) => column.notNull().defaultTo(false))
    .addColumn('habit_id', 'text', (column) => column.references('habit.id').onDelete('cascade'))
    .addColumn('created_at', 'timestamp', (column) => column.defaultTo(sql`CURRENT_TIMESTAMP`))
    .execute()

  console.log(description)
}

async function down(db: Kysely<any>): Promise<void> {
  console.log(description)

  await db.schema.dropTable('task').ifExists().execute()
}

export const Migration20250420: Migration = { up, down }
