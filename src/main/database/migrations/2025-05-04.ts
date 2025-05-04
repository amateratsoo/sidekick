/* eslint-disable @typescript-eslint/no-explicit-any */
import { Kysely, sql, type Migration } from 'kysely'

const description = `
* 🔪 deleted the \`completed_date\` and the \`habit_completed_date\` tables
`

async function up(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('completed_date').ifExists().execute()
  await db.schema.dropTable('habit_completed_date').ifExists().execute()

  await db.schema
    .createTable('completed_habit')
    .ifNotExists()
    .addColumn('habit_id', 'text', (column) =>
      column.references('habit.id').notNull().onDelete('cascade')
    )
    .addColumn('created_at', 'timestamp', (column) => column.defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn('completed_on', 'date', (column) => column.notNull())
    .addPrimaryKeyConstraint('primary_key', ['habit_id', 'completed_on'])
    .execute()

  console.log(description)
}

async function down(db: Kysely<any>): Promise<void> {
  console.log(description)

  await db.schema.dropTable('completed_habit').ifExists().execute()
}

export const Migration20250504: Migration = { up, down }
