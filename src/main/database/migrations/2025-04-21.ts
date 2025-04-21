/* eslint-disable @typescript-eslint/no-explicit-any */
import { Kysely, sql, type Migration } from 'kysely'

const description = `
* ✏️ changed datatype of column \`is_completed\` in \`task\` table 
from \`boolean\` to \`int\` because sqlite can't handle \`booleans\`
`

async function up(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('task').execute()

  await db.schema
    .createTable('task')
    .ifNotExists()
    .addColumn('id', 'text', (column) => column.primaryKey().notNull())
    .addColumn('name', 'text', (column) => column.defaultTo('✏️ Dê um nome bonito a sua tarefa...'))
    .addColumn('description', 'text')
    .addColumn('is_completed', 'integer', (column) => column.notNull().defaultTo(0))
    .addColumn('habit_id', 'text', (column) => column.references('habit.id').onDelete('cascade'))
    .addColumn('created_at', 'timestamp', (column) => column.defaultTo(sql`CURRENT_TIMESTAMP`))
    .execute()

  console.log(description)
}

async function down(db: Kysely<any>): Promise<void> {
  console.log(description)

  await db.schema.dropTable('task').ifExists().execute()
}

export const Migration20250421: Migration = { up, down }
