import Sqlite from 'better-sqlite3'
import { Kysely, Migrator, SqliteDialect, Migration, MigrationResultSet } from 'kysely'

import { pathToDb } from '../../../shared/constants'
import type { Schema } from '../schema'

async function migrator(): Promise<void> {
  const migrationType =
    process.argv[2] == 'down'
      ? 'migrateDown'
      : process.argv[2] == 'up'
        ? 'migrateUp'
        : process.argv[2] == 'latest'
          ? 'migrateToLatest'
          : process.argv[2] == 'to' && process.argv[3].length > 0
            ? 'migrateTo'
            : null

  if (!migrationType) {
    console.error(`📍 the migration was not executed, you need to provide 
  one of the following migration types:
      * down
      * up
      * latest
      * to Migration[yyyymmdd]
      `)

    process.exit(1)
  }

  const logs =
    process.argv[2] == 'down'
      ? 'down ⬇️'
      : process.argv[2] == 'up'
        ? 'up ⬆️'
        : process.argv[2] == 'latest'
          ? 'to the latest 💪'
          : process.argv[2] == 'to' && process.argv[3].length > 0
            ? `to -> ('${process.argv[3]}') ⌚`
            : null

  const db = new Kysely<Schema>({
    dialect: new SqliteDialect({
      database: new Sqlite(pathToDb)
    })
  })

  const migrator = new Migrator({
    db,
    provider: {
      async getMigrations(): Promise<Record<string, Migration>> {
        const { migrations } = await import('./index')
        return migrations
      }
    }
  })

  const { error, results } = (await migrator[migrationType](process.argv[3])) as MigrationResultSet

  if (results?.length == 0) {
    console.info(`✅ migration was not executed.
      **your database and your schema are already in sync**`)
    return
  }
  console.log(`👀 migrating ${logs}`)

  results?.forEach((it) => {
    if (it.status == 'Success') {
      console.log(`✅ migration "${it.migrationName}" was executed successfully`)
    } else if (it.status == 'Error') {
      console.error(`📍 failed to execute migration "${it.migrationName}"`)
    }
  })

  if (error) {
    console.error('📍 failed to migrate')
    console.error(error)
    process.exit(1)
  }
}

migrator()
