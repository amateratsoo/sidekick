import { createHabit, findAll } from './habit'
import { createTask } from './task'

export const db = {
  habit: {
    createHabit,
    findAll
  },
  task: {
    createTask
  }
}
