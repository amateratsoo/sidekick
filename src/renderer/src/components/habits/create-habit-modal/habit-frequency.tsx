import type { SetStateAction } from 'react'
import { InfoCircledIcon } from '@radix-ui/react-icons'
import { cn } from '@renderer/utils'

interface Props {
  habitsWeekdays: string[]
  setHabitsWeekdays: (state: SetStateAction<string[]>) => void
  showError: boolean
  setShowError: (state: SetStateAction<boolean>) => void
}

const weekdays = ['segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado', 'domingo']

export function HabitFrequency({
  habitsWeekdays,
  setHabitsWeekdays,
  showError,
  setShowError
}: Props): JSX.Element {
  return (
    <div className="mt-5">
      <label htmlFor="" className="text-lg text-zinc-500/40">
        Frequência
      </label>
      <div className="mt-3 flex flex-wrap gap-1">
        {weekdays.map((weekday) => {
          return (
            <button
              type="button"
              onClick={() => {
                if (showError) {
                  setShowError(false)
                }

                if (habitsWeekdays.includes(weekday)) {
                  setHabitsWeekdays((prev) => prev.filter((w) => w != weekday))
                  return
                }
                setHabitsWeekdays((prev) => [...prev, weekday])
              }}
              key={weekday}
              className={cn(
                'rounded-full text-zinc-300 border border-zinc-900 px-2.5 py-[2.8px] cursor-pointer',
                {
                  'bg-green-500 text-zinc-950': habitsWeekdays.includes(weekday)
                }
              )}
            >
              {weekday}
            </button>
          )
        })}
      </div>

      {showError && (
        <span className="flex gap-1 text-red-500 text-sm items-center mt-2">
          {' '}
          <InfoCircledIcon /> {'hey! precisa escolher ao menos um dia na semana'}
        </span>
      )}
    </div>
  )
}
