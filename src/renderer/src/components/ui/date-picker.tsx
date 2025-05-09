import { getAllDaysOfMonth } from '@renderer/utils/get-all-days-of-month'

export function DatePicker() {
  const d = getAllDaysOfMonth()

  console.log(d)

  return <div>calendar</div>
}
