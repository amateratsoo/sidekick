import { ScrollArea } from '@renderer/components/ui'
import { cn, getAllDaysOfTheYear } from '@renderer/utils'
import dayjs from 'dayjs'
import { CSSProperties, useMemo } from 'react'

interface Props {
  mode: 'yearly' | 'monthly'
  completedHabitDates: string[]
  color: string
}

export function CompletionGraph({ mode, completedHabitDates, color }: Props) {
  const allDays = useMemo(() => getAllDaysOfTheYear(), [])
  const completedDatesParsed = useMemo(
    () => completedHabitDates.map((date) => dayjs(date, 'DD/MM/YYYY')),
    [completedHabitDates]
  )

  const isDateCompleted = (day: number, month: number) =>
    completedDatesParsed.some(
      (d) => d.date() === day && d.month() === month && d.year() === dayjs().year()
    )

  const isToday = (day: number, month: number) =>
    day === dayjs().date() && month === dayjs().month()

  return (
    <ScrollArea className="w-[calc(100%+0.4rem)] overflow-x-scroll px-1.5">
      {mode === 'monthly' ? (
        <div className="flex min-w-[calc(100%+60rem)] gap-12">
          {allDays.map((month, monthIndex) => {
            const monthName = dayjs().localeData().months()[monthIndex]
            const prevMonthDays = allDays[monthIndex > 0 ? monthIndex - 1 : allDays.length - 1]
            const dayOfWeekStart = dayjs(`${dayjs().year()}-${monthIndex + 1}-1`).day()
            const paddingDays = prevMonthDays.slice(prevMonthDays.length - dayOfWeekStart)
            const fullMonth = [paddingDays, month]

            return (
              <div key={monthName}>
                <h3 className="text-zinc-500 font-semibold font-sans mb-3">{monthName}</h3>
                <div className="grid grid-cols-7 gap-x-[1.54rem] gap-y-1.5">
                  {fullMonth.map((days, dMonthIndex) =>
                    days.map((day, dayIndex) => {
                      const completed = isDateCompleted(day, monthIndex)
                      const today = isToday(day, monthIndex)

                      return (
                        <div
                          key={`${monthIndex}-${dMonthIndex}-${dayIndex}`}
                          className={cn('size-5 mx-auto rounded-md bg-zinc-900', {
                            'ring-2 ring-zinc-800': today && dMonthIndex === 1,
                            'opacity-40': dMonthIndex === 0
                          })}
                          style={
                            {
                              backgroundColor: completed ? color : 'oklch(21% 0.006 285.885)'
                            } as CSSProperties
                          }
                        />
                      )
                    })
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="w-[calc(100%+60rem)] flex flex-wrap gap-1">
          {allDays.map((month, monthIndex) =>
            month.map((day, dayIndex) => {
              const completed = isDateCompleted(day, monthIndex)
              const today = isToday(day, monthIndex)

              return (
                <div
                  key={`${monthIndex}-${dayIndex}`}
                  className={cn('size-5 rounded-md bg-zinc-900', {
                    'ring-2 ring-zinc-800': today
                  })}
                  style={
                    {
                      backgroundColor: completed ? color : 'oklch(21% 0.006 285.885)'
                    } as CSSProperties
                  }
                />
              )
            })
          )}
        </div>
      )}
    </ScrollArea>
  )
}
