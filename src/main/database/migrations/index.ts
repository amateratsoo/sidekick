import { Migration } from 'kysely'
import { Migration20250306 } from './2025-03-06'
import { Migration20250308 } from './2025-03-08'
import { Migration20250420 } from './2025-04-20'
import { Migration20250421 } from './2025-04-21'
import { Migration20250504 } from './2025-05-04'

export const migrations: Record<string, Migration> = {
  Migration20250306,
  Migration20250308,
  Migration20250420,
  Migration20250421,
  Migration20250504
}
