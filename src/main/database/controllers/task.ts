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
  try {
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
  } catch (error) {
    throw error
  }
}

export async function findAllByHabitId(id: string): Promise<SelectableTask[]> {
  try {
    const tasks = await db.selectFrom('task').where('habit_id', '=', id).selectAll().execute()

    return tasks.map((task) => {
      return {
        ...task,
        is_completed: !!task.is_completed
      }
    })
  } catch (error) {
    throw error
  }
}

export async function destroy(id: string) {
  try {
    await db.deleteFrom('task').where('task.id', '=', id).execute()
  } catch (error) {
    throw error
  }
}

export async function update({
  id,
  valuesToUpdate
}: {
  id: string
  valuesToUpdate: UpdateableTask
}): Promise<void> {
  try {
    await db.updateTable('task').set(valuesToUpdate).where('id', '=', id).execute()
  } catch (error) {
    throw error
  }
}
