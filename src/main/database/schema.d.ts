import { JSONColumnType, Insertable, Updateable, Selectable, ColumnType } from 'kysely'

export type Weekdays = 'segunda' | 'terça' | 'quarta' | 'quinta' | 'sexta' | 'sábado' | 'domingo'

export interface Schema {
  habit: HabitTable
  task: TaskTable
  journal: JournalTable
  completed_date: CompletedDateTable
  habit_completed_date: Habit_CompletedDate_Table
}

export interface HabitTable {
  id: ColumnType<string, string | undefined, never>
  name: string
  description: string | undefined
  badge: ColumnType<string, string | undefined, string | undefined>
  color: ColumnType<string, string | undefined, string | undefined>
  frequency: JSONColumnType<Weekdays[]>
  streak: ColumnType<number, number | undefined, number>
  created_at: ColumnType<Date, string | undefined, never>
}

interface TaskTable {
  id: string
  name: string
  description: string | undefined
  is_completed: boolean
  habit_id: string
  created_at: ColumnType<Date, string | undefined, never>
}

// interface JournalTable {
//   id: string
//   title: string
//   content: string | undefined
//   habit_id: string
//   created_at: ColumnType<Date, string | undefined, never>
// }

interface CompletedDateTable {
  id: string
  created_at: ColumnType<Date, string | undefined, never>
}

interface Habit_CompletedDate_Table {
  id: string // [habit.id completed_date.id]
  habit_id: string
  completed_date_id: string
  created_at: ColumnType<Date, string | undefined, never>
}

export type SelectableHabit = {
  tasks?: SelectableTask[]
} & Selectable<HabitTable>
export type InsertableHabit = Insertable<HabitTable>
export type UpdateableHabit = Updateable<HabitTable>

export type SelectableTask = Selectable<TaskTable>
export type InsertableTask = Insertable<TaskTable>
export type UpdateableTask = Updateable<TaskTable>

// export type SelectableJournal = Selectable<JournalTable>
// export type InsertableJournal = Insertable<JournalTable>
// export type UpdateableJournal = Updateable<JournalTable>

export type SelectableCompletedDate = Selectable<CompletedDateTable>
export type InsertableCompletedDate = Insertable<CompletedDateTable>
export type UpdateableCompletedDate = Updateable<CompletedDateTable>

export type SelectableHabit_CompletedDate_Table = Selectable<Habit_CompletedDate_Table>
export type InsertableHabit_CompletedDate_Table = Insertable<Habit_CompletedDate_Table>
export type UpdateableHabit_CompletedDate_Table = Updateable<Habit_CompletedDate_Table>
