/* eslint-disable @typescript-eslint/no-explicit-any */
import { Kysely, sql, type Migration } from 'kysely'

const description = `
* ⬆️ added the \`completed_date\` and the \`habit_completed_date\` tables
* 💡 now id's are not viewed as auto generated as sqlite does not support uuids
  * this happens at the schema level only and not on the db level 
`

async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('completed_date')
    .ifNotExists()
    .addColumn('id', 'text', (column) => column.primaryKey().notNull())
    .addColumn('created_at', 'timestamp', (column) => column.defaultTo(sql`CURRENT_TIMESTAMP`))
    .execute()

  await db.schema
    .createTable('habit_completed_date')
    .ifNotExists()
    .addColumn('habit_id', 'text', (column) =>
      column.references('habit.id').notNull().onDelete('cascade')
    )
    .addColumn('completed_date_id', 'text', (column) =>
      column.references('completed_date.id').notNull().onDelete('cascade')
    )
    .addColumn('created_at', 'timestamp', (column) => column.defaultTo(sql`CURRENT_TIMESTAMP`))
    .addPrimaryKeyConstraint('primary_key', ['habit_id', 'completed_date_id'])
    .execute()

  console.log(description)
}

async function down(db: Kysely<any>): Promise<void> {
  console.log(description)

  await db.schema.dropTable('completed_date').ifExists().execute()
  await db.schema.dropTable('habit_completed_date').ifExists().execute()
}

export const Migration20250308: Migration = { up, down }
