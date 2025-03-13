import { Migration } from 'kysely'
import { Migration20250306 } from './2025-03-06'
import { Migration20250308 } from './2025-03-08'

export const migrations: Record<string, Migration> = {
  Migration20250306,
  Migration20250308
}
