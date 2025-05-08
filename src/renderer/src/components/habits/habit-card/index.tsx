import { useMemo, type CSSProperties } from 'react'
import dayjs, { type Dayjs } from 'dayjs'
import { useAtomValue } from 'jotai'

import { habitsAtom } from '@renderer/store'
import type { SelectableHabit } from '@shared/types'
import { cn, getAllDaysOfTheYear } from '@renderer/utils'

const weekdays = ['dom', 'seg', 'ter', 'quar', 'quin', 'sex', 'sab']

export function HabitCard({
  name,
  badge,
  id,
  color
}: Pick<SelectableHabit, 'name' | 'badge' | 'id' | 'color'>): JSX.Element {
  const allDays = useMemo(() => getAllDaysOfTheYear(), [])
  const currentMonth = dayjs().month()
  const currentYear = dayjs().year()
  const habits = useAtomValue(habitsAtom)
  const currentHabit = habits.find((habit) => habit.id === id)

  const completedHabitDates = useMemo<Dayjs[]>(
    () => currentHabit?.completedOn.map((date) => dayjs(date, 'DD/MM/YYYY')) ?? [],
    [currentHabit]
  )

  const paddedDays = useMemo(() => {
    const current = allDays[currentMonth]
    const prev = allDays[currentMonth > 0 ? currentMonth - 1 : allDays.length - 1]
    const startDayOfWeek = dayjs(`${currentYear}-${currentMonth + 1}-1`).day()
    const leadingDays = prev.slice(prev.length - startDayOfWeek)
    return [leadingDays, current]
  }, [allDays, currentMonth, currentYear])

  const isCompleted = (day: number) =>
    completedHabitDates.some(
      (d) => d.date() === day && d.year() === currentYear && d.month() === currentMonth
    )

  const isToday = (day: number) => day === dayjs().date() && currentMonth === dayjs().month()

  return (
    <div className="select-none border border-zinc-900 bg-zinc-900/20 rounded-xl min-h-36 flex flex-col items-center justify-center p-1">
      <header className="w-full p-2 flex items-center gap-2">
        <div className="rounded-lg p-2 bg-zinc-900/60 text-xl aspect-square">{badge}</div>
        <div className="-space-y-1.5 text-left">
          <span className="block text-zinc-500/20 text-base font-bold font-serif">Eu vou</span>
          <p className="text-zinc-300 font-bold font-sans text-lg line-clamp-1">{name}</p>
        </div>
      </header>

      <div className="grid grid-cols-7 col-end-7 gap-y-1.5 w-full p-2 pt-[5px]">
        {weekdays.map((day) => (
          <p key={day} className="text-zinc-500/40 font-serif text-lg text-center font-semibold">
            {day}
          </p>
        ))}

        {paddedDays.map((month, monthIndex) =>
          month.map((day, dayIndex) => (
            <div
              key={`${monthIndex}-${dayIndex}`}
              className={cn('size-5 mx-auto rounded-md bg-zinc-900', {
                'ring-2 ring-zinc-800': isToday(day) && monthIndex === 1,
                'opacity-40': monthIndex === 0
              })}
              style={
                {
                  backgroundColor: isCompleted(day) ? color : 'oklch(21% 0.006 285.885)'
                } as CSSProperties
              }
            />
          ))
        )}
      </div>
    </div>
  )
}
