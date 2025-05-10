import { useState, type SetStateAction } from 'react'
import { getAllDaysOfMonth } from '@renderer/utils/get-all-days-of-month'
import dayjs from 'dayjs'
import { CaretLeftIcon, CaretRightIcon } from '@radix-ui/react-icons'

const currentMonth = dayjs().month()
const currentYear = dayjs().year()
const months = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro'
]

const weekdays = ['Dom', 'Seg', 'Ter', 'Quar', 'Quin', 'Sex', 'Sab']

interface Props {
  initialSelectedDate?: string
  handleSelectedDate: (state: SetStateAction<string>) => void
  min?: string
  max?: string
}

export function DatePicker({ handleSelectedDate, initialSelectedDate = '', min, max }: Props) {
  const [selectedDate, setSelectedDate] = useState(initialSelectedDate)
  const [date, setDate] = useState({
    month: currentMonth + 1,
    year: currentYear
  })
  const { leftPaddedDays, currentMonthDays, rightPaddedDays } = getAllDaysOfMonth({
    month: date.month,
    year: date.year,
    padding: 'both'
  })

  function increaseDate() {
    /* 
      if we are on the last month
      reset the month to january
      and go to the next year 
    */
    const shouldGoNextYear = date.month === 12

    const d = {
      month: shouldGoNextYear ? 1 : date.month + 1,
      year: shouldGoNextYear ? date.year + 1 : date.year
    }

    setDate(d)
  }

  function decreaseDate() {
    /* 
      if we are on the first month
      reset the month to december
      and go to the previous year 
    */
    const shouldGoPreviousYear = date.month === 1

    const d = {
      month: shouldGoPreviousYear ? 12 : date.month - 1,
      year: shouldGoPreviousYear ? date.year - 1 : date.year
    }

    setDate(d)
  }

  return (
    <div className="text-zinc-300 border border-zinc-900 bg-zinc-900/20 rounded-xl p-2 pt-1 shadow-zinc-900/40 shadow-2xl">
      <header className="flex justify-between items-center p-2">
        <button onClick={decreaseDate} className="p-1.5 hover:bg-zinc-900/50 rounded-lg">
          <CaretLeftIcon className="size-5 text-zinc-700" />
        </button>

        <span className="text-base font-semibold">
          {months[Math.max(0, date.month - 1)]} {date.year}
        </span>

        <button onClick={increaseDate} className="p-1.5 hover:bg-zinc-900/50 rounded-lg">
          <CaretRightIcon className="size-5 text-zinc-700" />
        </button>
      </header>

      <div className="grid grid-cols-7">
        {weekdays.map((day) => (
          <p key={day} className="text-zinc-500/40 font-serif text-lg text-center font-semibold">
            {day}
          </p>
        ))}
        {[...leftPaddedDays, ...currentMonthDays, ...rightPaddedDays].map(
          ({ day, type }, index) => {
            const month =
              type === 'paddedLeft'
                ? date.month - 1
                : type === 'paddedRight'
                  ? date.month + 1
                  : date.month

            const d = `${date.year}-${month}-${day}`
            const formatedDate = dayjs(d).format('DD/MM/YYYY')

            console.log(dayjs(d).isAfter(max))

            return (
              <button
                disabled={false}
                key={index}
                data-is-selected={selectedDate === formatedDate}
                onClick={() => {
                  setSelectedDate(formatedDate)
                  handleSelectedDate(formatedDate)
                }}
                className={`${type === 'current' ? 'text-zinc-300' : 'text-zinc-500/40'} ${true && 'hover:bg-zinc-900/50'} aspect-square size-10 rounded-lg flex items-center justify-center data-[is-selected=true]:bg-zinc-900`}
              >
                <div key={index}>{day}</div>
              </button>
            )
          }
        )}
      </div>
    </div>
  )
}
