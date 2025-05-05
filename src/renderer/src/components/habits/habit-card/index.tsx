import dayjs from 'dayjs'

import type { SelectableHabit } from '@shared/types'
import { cn, getAllDaysOfTheYear } from '@renderer/utils'

const currentMonth = dayjs().month()
const index = currentMonth > 0 ? currentMonth : getAllDaysOfTheYear().length - 1
const daysOfLastMonth = getAllDaysOfTheYear()[index - 1]
// const daysOfNextMonth = getAllDaysOfTheYear()[currentMonth + 1]
const daysOfTheMonth = getAllDaysOfTheYear()[currentMonth]
const weekdays = ['dom', 'seg', 'ter', 'quar', 'quin', 'sex', 'sab']
const dayOfTheWeekMonthStarted = dayjs(`${dayjs().year()}-${currentMonth + 1}-1`).day()
const d = [
  daysOfLastMonth.splice(
    daysOfLastMonth.length - dayOfTheWeekMonthStarted,
    dayOfTheWeekMonthStarted
  ),
  daysOfTheMonth
]

export function HabitCard({ name, badge }: SelectableHabit): JSX.Element {
  return (
    <div className="border border-zinc-900 bg-zinc-900/20 rounded-xl min-h-36 flex flex-col items-center justify-center p-1">
      <header className="w-full p-2 flex items-center gap-2">
        <div className="rounded-lg p-2 bg-zinc-900/60 text-xl aspect-square">{badge}</div>
        <div className="-space-y-1.5 text-left">
          <span className="block text-zinc-500/20 text-base font-bold font-serif">Eu vou</span>
          <p className="text-zinc-300 font-bold font-sans text-lg line-clamp-1">{name}</p>
        </div>
      </header>

      <div className="grid grid-cols-7 col-end-7 gap-y-1.5 w-full p-2">
        {weekdays.map((day) => {
          return (
            <p className="text-zinc-500/40 font-serif text-lg text-center font-semibold" key={day}>
              {day}
            </p>
          )
        })}

        {d.map((month, monthIndex) => {
          return month.map((day, dayIndex) => {
            return (
              <div
                key={`${day}-${monthIndex}-${dayIndex}`}
                className={cn('size-5 mx-auto rounded-md bg-zinc-900', {
                  'ring-2 ring-zinc-800': day == dayjs().date() && monthIndex == 1,
                  'opacity-40': monthIndex == 0
                })}
              />
            )
          })
        })}
      </div>
    </div>
  )
}
