import { db } from '../db'
import type { InsertableTask, SelectableTask, UpdateableTask } from '../schema'
import { generateUUID } from '../../../shared/constants'

export async function create({
  habit_id,
  id = generateUUID(),
  is_completed = false,
  name,
  description
}: InsertableTask): Promise<SelectableTask | undefined> {
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
    .executeTakeFirst()

  if (!task) return undefined

  return {
    ...task,
    is_completed: !!is_completed
  }
}

export async function findAllByHabitId(id: string): Promise<SelectableTask[]> {
  const tasks = await db.selectFrom('task').where('habit_id', '=', id).selectAll().execute()

  return tasks.map((task) => {
    return {
      ...task,
      is_completed: !!task.is_completed
    }
  })
}

export async function destroy(id: string) {
  await db.deleteFrom('task').where('task.id', '=', id).execute()
}

export async function update({
  id,
  valuesToUpdate
}: {
  id: string
  valuesToUpdate: UpdateableTask
}): Promise<void> {
  await db.updateTable('task').set(valuesToUpdate).where('id', '=', id).execute()
}
