import { createHabit, findAll } from './habit'
import { createTask, findAllByHabitId } from './task'

export const db = {
  habit: {
    createHabit,
    findAll
  },
  task: {
    createTask,
    findAllByHabitId
  }
}
