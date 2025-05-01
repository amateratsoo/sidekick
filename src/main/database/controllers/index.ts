import * as habit from './habit'
import * as task from './task'

export const db = {
  habit: {
    ...habit
  },
  task: {
    ...task
  }
}
