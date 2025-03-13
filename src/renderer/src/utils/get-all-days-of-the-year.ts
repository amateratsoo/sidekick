import dayjs from 'dayjs'

export function getAllDaysOfTheYear(year: number | undefined = dayjs().year()): number[][] {
  return Array.from({ length: 12 }, (_, monthIndex) =>
    Array.from(
      { length: dayjs(`${year}-${monthIndex + 1}-1`).daysInMonth() },
      (_, dayIndex) => dayIndex + 1
    )
  )
}
