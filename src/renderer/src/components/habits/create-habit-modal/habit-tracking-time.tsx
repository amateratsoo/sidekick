import { useState } from 'react'
import { ActionMenu } from '@renderer/components/ui'
import { CaretSortIcon } from '@radix-ui/react-icons'

const trackingTimes = [
  '7 dias',
  '15 dias',
  '30 dias',
  '45 dias',
  '90 dias',
  'Para sempre',
  'Customizado'
]

export function HabitTrackingTime() {
  const [trackingTime, setTrackingTime] = useState('Para sempre')

  return (
    <div className="mt-5">
      <label htmlFor="" className="text-lg text-zinc-500/40">
        Duração
      </label>
      <div className="mt-3">
        <ActionMenu
          sideOffset={52}
          side="top"
          align="start"
          triggerClassName="bg-transparent border-none m-0 p-0 outline-none"
          trigger={
            <div
              className="bg-zinc-900/15 py-2 px-2.5 ring-1 ring-zinc-800 text-zinc-300 outline-none focus-within:ring-zinc-300 rounded-lg flex items-center gap-1"
              role="combobox"
            >
              <span className="text-base">{trackingTime}</span>
              <CaretSortIcon className="size-3.5" />
            </div>
          }
          actions={trackingTimes.map((time) => ({
            name: time,
            action: () => setTrackingTime(time)
          }))}
        />
      </div>
    </div>
  )
}
