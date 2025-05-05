import { JSONColumnType, Insertable, Updateable, Selectable, ColumnType } from 'kysely'

export type Weekdays = 'segunda' | 'terça' | 'quarta' | 'quinta' | 'sexta' | 'sábado' | 'domingo'

export interface Schema {
  habit: HabitTable
  task: TaskTable
  completed_habit: CompletedHabitTable
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
  id: ColumnType<string, string | undefined, never>
  name: string | undefined
  description: string | undefined
  is_completed?: ColumnType<boolean, 0 | 1 | boolean, 0 | 1 | boolean>
  habit_id: string
  created_at: ColumnType<Date, string | undefined, never>
}

interface CompletedHabitTable {
  // the id is a compund primary key [habit.id completed_on]
  // so we don't need to specify it
  habit_id: string
  completed_on: string
  created_at: ColumnType<Date, string | undefined, never>
}

export interface SelectableHabit extends Selectable<HabitTable> {
  tasks?: SelectableTask[]
}
export type InsertableHabit = Insertable<HabitTable>
export type UpdateableHabit = Updateable<HabitTable>

export type SelectableTask = Selectable<TaskTable>
export type InsertableTask = Insertable<TaskTable>
export type UpdateableTask = Updateable<TaskTable>

export type SelectableCompletedHabit = Selectable<CompletedHabitTable>
export type InsertableCompletedHabit = Insertable<CompletedHabitTable>
export type UpdateableCompletedHabit = Updateable<CompletedHabitTable>
