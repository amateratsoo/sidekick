import type {
  InsertableHabit,
  SelectableHabit,
  SelectableTask,
  InsertableTask
} from 'src/main/database/schema'

export interface Api {
  db: {
    habit: {
      createHabit: (args: InsertableHabit) => Promise<SelectableHabit>
      findAll: () => Promise<SelectableHabit[]>
    }
  }
  window: {
    maximize: () => void
    minimize: () => void
    close: () => void
  }
}

export type { InsertableHabit, SelectableHabit, InsertableTask, SelectableTask }
