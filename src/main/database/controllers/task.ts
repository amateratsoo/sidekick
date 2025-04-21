import { db } from '../db'
import type { InsertableTask, SelectableTask, UpdateableTask } from '../schema'
import { generateUUID } from '../../../shared/constants'

export async function createTask({
  habit_id,
  id = generateUUID(),
  is_completed = false,
  name,
  description
}: InsertableTask): Promise<SelectableTask> {
  const task = await db
    .insertInto('task')
    .values({
      habit_id,
      id,
      is_completed: is_completed ? 1 : 0,
      name,
      description
    })
    .returningAll()
    .execute()

  return {
    ...task[0],
    is_completed: !!is_completed
  }
}
