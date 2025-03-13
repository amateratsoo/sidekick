import type { InsertableHabit, SelectableHabit } from 'src/main/database/schema'

export interface Api {
  db: {
    habit: {
      createHabit: (args: InsertableHabit) => Promise<SelectableHabit>
      findAll: () => Promise<SelectableHabit[]>
    }
  }
}

export type { InsertableHabit, SelectableHabit }
