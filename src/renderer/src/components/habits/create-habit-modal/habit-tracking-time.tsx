import { useState } from 'react'
import { ActionMenu, Popover } from '@renderer/components/ui'
import { CaretSortIcon } from '@radix-ui/react-icons'
import dayjs from 'dayjs'
import { CheckIcon } from '@radix-ui/react-icons'
import { DatePicker } from '@renderer/components/ui'
import { GlowingStars } from '@renderer/components/svg'

const trackingTimes = [
  '7 dias',
  '15 dias',
  '30 dias',
  '45 dias',
  '90 dias',
  'Para sempre',
  'Customizado'
]

const today = dayjs()

export function HabitTrackingTime() {
  const [trackingTime, setTrackingTime] = useState('Para sempre')
  const [startDate, setStartDate] = useState(today.format('DD/MM/YYYY'))
  const [endDate, setEndDate] = useState(today.add(7, 'days').format('DD/MM/YYYY'))

  return (
    <div className="mt-5">
      <label htmlFor="duration-combobox" className="text-lg text-zinc-500/40">
        Duração
      </label>
      <div className="mt-3">
        <ActionMenu
          side="right"
          align="end"
          triggerClassName="bg-transparent border-none m-0 p-0 outline-none ring-zinc-400 -focus-within:ring-2"
          trigger={
            <div
              id="duration-combobox"
              className="bg-zinc-900/15 py-2 px-2.5 ring-1 ring-zinc-800 text-zinc-300 outline-none focus-within:ring-zinc-300 rounded-lg flex items-center gap-1"
              role="combobox"
            >
              <span className="text-base">{trackingTime}</span>
              <CaretSortIcon className="size-3.5" />
            </div>
          }
          actions={trackingTimes.map((time) => ({
            name: time,
            action: () => setTrackingTime(time),
            icon: trackingTime == time ? CheckIcon : undefined,
            containerClassName: 'border-none bg-transparent px-0 -mr-1'
          }))}
        />

        {trackingTime == 'Customizado' && (
          <div className="flex gap-5 mt-4">
            <div>
              <label htmlFor="duration-combobox" className="text-base text-zinc-500/40">
                Data de início
              </label>
              <Popover
                side="bottom"
                sideOffset={8}
                trigger={
                  <button className="bg-zinc-900/15 py-2 px-2.5 ring-1 ring-zinc-800 text-zinc-300 outline-none rounded-lg flex items-center gap-1 mt-2">
                    <span className="text-base">{startDate}</span>
                    <CaretSortIcon className="size-3.5" />
                  </button>
                }
              >
                <DatePicker initialSelectedDate={startDate} handleSelectedDate={setStartDate} />
              </Popover>
            </div>

            <div>
              <label htmlFor="duration-combobox" className="text-base text-zinc-500/40">
                Data de fim
              </label>
              <Popover
                side="bottom"
                sideOffset={8}
                trigger={
                  <button className="bg-zinc-900/15 py-2 px-2.5 ring-1 ring-zinc-800 text-zinc-300 outline-none rounded-lg flex items-center gap-1 mt-2">
                    <span className="text-base">{endDate}</span>
                    <CaretSortIcon className="size-3.5" />
                  </button>
                }
              >
                <DatePicker initialSelectedDate={endDate} handleSelectedDate={setEndDate} />
              </Popover>
            </div>
          </div>
        )}

        <div className="text-zinc-600 text-sm pt-4 flex items-center">
          <GlowingStars />
          Voce não controla o &nbsp; <span className="underline">tempo</span>, mas pode escolher
          como vai usa-lo
        </div>
      </div>
    </div>
  )
}
