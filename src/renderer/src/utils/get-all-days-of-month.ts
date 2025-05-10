import dayjs from 'dayjs'

interface Props {
  month?: number
  padding?: 'left' | 'right' | 'both' | 'none'
  year?: number
}

interface Day {
  type: 'current' | 'paddedLeft' | 'paddedRight'
  day: number
}

export function getAllDaysOfMonth(props?: Props) {
  // assert default values if props is undefined
  const month = props?.month || dayjs().month() + 1 // 1 -> january; 12 -> december
  const padding = props?.padding || 'none'
  const year = props?.year || dayjs().year()

  const date = `${year}-${month}-${1}`
  const days = dayjs(date).daysInMonth()

  let leftPaddedDays: Day[] = []
  let rightPaddedDays: Day[] = []

  if (padding === 'left' || padding === 'both') {
    const startOfMonthWeekDay = dayjs(date).startOf('month').day()
    const prevMonthDays = dayjs(date).subtract(1, 'month').daysInMonth()
    leftPaddedDays = Array.from(
      { length: prevMonthDays },
      (_, index) => ({ type: 'paddedLeft', day: index + 1 }) as Day
    ).slice(prevMonthDays - startOfMonthWeekDay)
  }

  if (padding === 'right' || padding === 'both') {
    const startOfNextMonthWeekDay = dayjs(date).add(1, 'month').startOf('month').day()

    if (startOfNextMonthWeekDay > 0) {
      const daysInAWeek = 7
      const diff = Math.abs(startOfNextMonthWeekDay - daysInAWeek)
      rightPaddedDays = Array.from(
        { length: diff },
        (_, index) => ({ type: 'paddedRight', day: index + 1 }) as Day
      )
    }
  }

  const currentMonthDays: Day[] = Array.from(
    { length: days },
    (_, index) => ({ type: 'current', day: index + 1 }) as Day
  )

  return {
    leftPaddedDays,
    currentMonthDays,
    rightPaddedDays
  }
}
