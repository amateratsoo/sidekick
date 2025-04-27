import { ScrollArea } from '@renderer/components/ui'
import { cn, getAllDaysOfTheYear } from '@renderer/utils'
import dayjs from 'dayjs'

interface Props {
  mode: 'yearly' | 'monthly'
}

export function CompletionGraph({ mode }: Props) {
  return (
    <ScrollArea className="w-[calc(100%+0.4rem)] overflow-x-scroll px-1.5">
      {mode == 'monthly' ? (
        <div className="flex min-w-[calc(100%+60rem)] gap-12">
          {getAllDaysOfTheYear().map((month, monthIndex) => {
            const monthName = dayjs().localeData().months()[monthIndex]
            const index = monthIndex > 0 ? monthIndex : getAllDaysOfTheYear().length - 1
            const daysOfLastMonth = getAllDaysOfTheYear()[index - 1]
            const dayOfTheWeekMonthStarted = dayjs(`${dayjs().year()}-${monthIndex + 1}-1`).day()
            const d = [
              daysOfLastMonth.splice(
                daysOfLastMonth.length - dayOfTheWeekMonthStarted,
                dayOfTheWeekMonthStarted
              ),
              month
            ]

            return (
              <div key={monthName}>
                <h3 className="text-zinc-500 font-semibold font-sans mb-3">{monthName}</h3>
                <div className="grid grid-cols-7 gap-x-[1.54rem] gap-y-1.5">
                  {d.map((month, dMonthIndex) => {
                    return month.map((day, dayIndex) => {
                      return (
                        <div
                          key={`${day}-${monthIndex}-${dayIndex}`}
                          className={cn('size-5 mx-auto rounded-md bg-zinc-900', {
                            'ring-2 ring-zinc-800':
                              day == dayjs().date() &&
                              monthIndex == dayjs().month() &&
                              dMonthIndex == 1,
                            'opacity-40': dMonthIndex == 0
                          })}
                        />
                      )
                    })
                  })}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="w-[calc(100%+60rem)] flex flex-wrap gap-1">
          {getAllDaysOfTheYear().map((month, monthIndex) => {
            return month.map((day) => {
              return (
                <div
                  key={day}
                  className={cn('size-5 rounded-md bg-zinc-900', {
                    'ring-2 ring-zinc-800': monthIndex == dayjs().month() && day == dayjs().date()
                  })}
                />
              )
            })
          })}
        </div>
      )}
    </ScrollArea>
  )
}
