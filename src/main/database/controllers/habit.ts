import { jsonArrayFrom } from 'kysely/helpers/sqlite'
import dayjs from 'dayjs'

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
  try {
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

    return habit
  } catch (error) {
    throw error
  }
}

export async function findAll(): Promise<SelectableHabit[]> {
  try {
    const habits = await db.selectFrom('habit').selectAll().execute()

    return habits.map((habit) => {
      return {
        ...habit,
        frequency: JSON.parse(String(habit.frequency))
      }
    })
  } catch (error) {
    throw error
  }
}

export async function findAllWithTasks(): Promise<SelectableHabit[]> {
  try {
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
  } catch (error) {
    throw error
  }
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
  try {
    await db.updateTable('habit').set(valuesToUpdate).where('id', '=', id).execute()
  } catch (error) {
    throw error
  }
}

export async function isComplited({
  habitId,
  date = dayjs().format('DD/MM/YYYY')
}: {
  habitId: string
  date?: string
}) {
  try {
    return !!(await db
      .selectFrom('completed_habit')
      .selectAll()
      .where('habit_id', '=', habitId)
      .where('completed_on', '=', date)
      .executeTakeFirst())
  } catch (error) {
    throw error
  }
}

export async function findAllCompleted(habitId: string) {
  try {
    return await db
      .selectFrom('completed_habit')
      .selectAll()
      .where('habit_id', '=', habitId)
      .execute()
  } catch (error) {
    throw error
  }
}

export async function check({
  habitId,
  date = dayjs().format('DD/MM/YYYY')
}: {
  habitId: string
  date?: string
}) {
  try {
    await db
      .insertInto('completed_habit')
      .values({
        habit_id: habitId,
        completed_on: date
      })
      .execute()
  } catch (error) {
    throw error
  }
}

export async function uncheck({
  habitId,
  date = dayjs().format('DD/MM/YYYY')
}: {
  habitId: string
  date?: string
}) {
  try {
    await db
      .deleteFrom('completed_habit')
      .where('habit_id', '=', habitId)
      .where('completed_on', '=', date)
      .execute()
  } catch (error) {
    throw error
  }
}

// to separate domains and get intellisense support
export const streak = {
  increase: async ({ habitId, amount = 1 }: { habitId: string; amount?: number }) => {
    try {
      const currentStreak =
        (
          await db
            .selectFrom('habit')
            .select(['streak'])
            .where('id', '=', habitId)
            .executeTakeFirst()
        )?.streak || 0

      await db
        .updateTable('habit')
        .set({ streak: currentStreak + amount })
        .where('id', '=', habitId)
        .execute()
    } catch (error) {
      throw error
    }
  },

  reset: async (habitId: string) => {
    try {
      await db.updateTable('habit').set({ streak: 0 }).where('id', '=', habitId).execute()
    } catch (error) {
      throw error
    }
  },

  decrease: async ({ habitId, amount = 1 }: { habitId: string; amount?: number }) => {
    try {
      const currentStreak =
        (
          await db
            .selectFrom('habit')
            .select(['streak'])
            .where('id', '=', habitId)
            .executeTakeFirst()
        )?.streak || 0

      const streak = Math.max(currentStreak - amount, 0)

      await db.updateTable('habit').set({ streak: streak }).where('id', '=', habitId).execute()
    } catch (error) {
      throw error
    }
  }
}
