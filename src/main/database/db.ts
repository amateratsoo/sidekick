import Sqlite from 'better-sqlite3'
import { Kysely, SqliteDialect } from 'kysely'

import { pathToDb } from '../../shared/constants'
import { Schema } from './schema'

export const db = new Kysely<Schema>({
  dialect: new SqliteDialect({
    database: new Sqlite(pathToDb)
  })
})
