export type {
  InsertableHabit,
  SelectableHabit,
  SelectableTask,
  InsertableTask,
  UpdateableHabit,
  UpdateableTask
} from 'src/main/database/schema'

export type { HabitAtomProps } from 'src/renderer/src/store'

import { db } from 'src/main/database/controllers'

export interface Api {
  db: typeof db
  window: {
    maximize: () => void
    minimize: () => void
    close: () => void
  }
}
