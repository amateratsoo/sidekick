export type {
  InsertableHabit,
  SelectableHabit,
  SelectableTask,
  InsertableTask,
  UpdateableHabit,
  UpdateableTask
} from 'src/main/database/schema'

import { db } from 'src/main/database/controllers'

export interface Api {
  db: typeof db
  window: {
    maximize: () => void
    minimize: () => void
    close: () => void
  }
}
