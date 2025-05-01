import { jsonArrayFrom } from 'kysely/helpers/sqlite'

import { db } from '../db'
import type { InsertableHabit, SelectableHabit, SelectableTask, UpdateableHabit } from '../schema'
import { generateUUID } from '../../../shared/constants'

export async function create({
  id = generateUUID(),
  badge = undefined,
  color = undefined,
  frequency,
  streak = 0,
  name,
  description = ''
}: InsertableHabit): Promise<SelectableHabit | undefined> {
  const habit = await db
    .insertInto('habit')
    .values({
      id,
      badge,
      color,
      frequency,
      name,
      streak,
      description
    })
    .returningAll()
    .executeTakeFirst()

  if (!habit) return undefined

  return habit
}

export async function findAll(): Promise<SelectableHabit[]> {
  const habits = await db.selectFrom('habit').selectAll().execute()

  return habits.map((habit) => {
    return {
      ...habit,
      frequency: JSON.parse(String(habit.frequency))
    }
  })
}

export async function findAllWithRelations(): Promise<SelectableHabit[]> {
  const query = await db
    .selectFrom('habit')
    .selectAll()
    .select((eb) => [
      // tasks
      jsonArrayFrom(
        eb
          .selectFrom('task')
          .select([
            'task.id',
            'task.name',
            'task.is_completed',
            'task.habit_id',
            'task.description',
            'task.created_at'
          ])
          .whereRef('task.habit_id', '=', 'habit.id')
      ).as('tasks')
    ])
    .execute()

  /* 
    kysely relations recipe returns children as text
    and not json, so we need to parse and return
    each one of the children 
  */
  return query.map((row) => {
    return {
      ...row,
      tasks: JSON.parse(String(row.tasks)).map((task: SelectableTask) => {
        return {
          ...task,
          is_completed: !!task.is_completed
        }
      }) as SelectableTask[]
    }
  })
}

export async function destroy(id: string): Promise<void> {
  await db.deleteFrom('habit').where('id', '=', id).execute()
}

export async function update({
  id,
  valuesToUpdate
}: {
  id: string
  valuesToUpdate: UpdateableHabit
}): Promise<void> {
  await db.updateTable('habit').set(valuesToUpdate).where('id', '=', id).execute()
}
