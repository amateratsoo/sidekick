import { jsonArrayFrom } from 'kysely/helpers/sqlite'

import { db } from '../db'
import type { InsertableHabit, SelectableHabit, UpdateableHabit } from '../schema'
import { generateUUID } from '../../../shared/constants'

export async function createHabit({
  id = generateUUID(),
  badge = undefined,
  color = undefined,
  frequency,
  streak = 0,
  name,
  description = ''
}: InsertableHabit): Promise<SelectableHabit> {
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
    .execute()

  return habit[0]
}

export async function findAll(): Promise<SelectableHabit[]> {
  return await db
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
}

export async function deleteHabitById(id: string): Promise<void> {
  await db.deleteFrom('habit').where('id', '=', id).execute()
}

export async function updateHabitById({
  id,
  valuesToUpdate
}: {
  id: string
  valuesToUpdate: UpdateableHabit
}): Promise<void> {
  await db.updateTable('habit').set(valuesToUpdate).where('id', '=', id).execute()
}
