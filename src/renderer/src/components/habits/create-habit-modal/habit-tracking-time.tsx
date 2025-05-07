import { ReactElement, useRef, useState } from 'react'
import { ActionMenu, Popover } from '@renderer/components/ui'
import { CaretSortIcon } from '@radix-ui/react-icons'
import dayjs from 'dayjs'
import { CheckIcon } from '@radix-ui/react-icons'

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
                trigger={
                  <button className="cursor-pointer bg-zinc-900/15 py-2 px-2.5 ring-1 ring-zinc-800 text-zinc-300 outline-none focus-within:ring-zinc-300 rounded-lg flex items-center gap-1 mt-2">
                    <span className="text-base">{dayjs().format('DD/MM/YYYY')}</span>
                    <CaretSortIcon className="size-3.5" />
                  </button>
                }
              >
                <div>{dayjs().format('DD/MM/YYYY')}</div>
              </Popover>
            </div>

            <div>
              <label htmlFor="duration-combobox" className="text-base text-zinc-500/40">
                Data de fim
              </label>
              <Popover
                trigger={
                  <button className="cursor-pointer bg-zinc-900/15 py-2 px-2.5 ring-1 ring-zinc-800 text-zinc-300 outline-none focus-within:ring-zinc-300 rounded-lg flex items-center gap-1 mt-2">
                    <span className="text-base">{dayjs().add(7, 'days').format('DD/MM/YYYY')}</span>
                    <CaretSortIcon className="size-3.5" />
                  </button>
                }
              >
                <div>{dayjs().add(7, 'days').format('DD/MM/YYYY')}</div>
              </Popover>
            </div>
          </div>
        )}

        <div className="text-zinc-600 text-sm pt-4 flex items-center">
          <svg
            fill="currentColor"
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
            stroke="currentColor"
            className="size-5"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              {' '}
              <title></title>{' '}
              <g data-name="Layer 2" id="Layer_2">
                {' '}
                <path
                  className="animate-glow [animation-delay:0s]"
                  d="M18,11a1,1,0,0,1-1,1,5,5,0,0,0-5,5,1,1,0,0,1-2,0,5,5,0,0,0-5-5,1,1,0,0,1,0-2,5,5,0,0,0,5-5,1,1,0,0,1,2,0,5,5,0,0,0,5,5A1,1,0,0,1,18,11Z"
                ></path>{' '}
                <path
                  className="animate-glow [animation-delay:0.5s]"
                  d="M19,24a1,1,0,0,1-1,1,2,2,0,0,0-2,2,1,1,0,0,1-2,0,2,2,0,0,0-2-2,1,1,0,0,1,0-2,2,2,0,0,0,2-2,1,1,0,0,1,2,0,2,2,0,0,0,2,2A1,1,0,0,1,19,24Z"
                ></path>{' '}
                <path
                  className="animate-glow [animation-delay:1s]"
                  d="M28,17a1,1,0,0,1-1,1,4,4,0,0,0-4,4,1,1,0,0,1-2,0,4,4,0,0,0-4-4,1,1,0,0,1,0-2,4,4,0,0,0,4-4,1,1,0,0,1,2,0,4,4,0,0,0,4,4A1,1,0,0,1,28,17Z"
                ></path>{' '}
              </g>{' '}
            </g>
          </svg>
          Voce não controla o &nbsp; <span className="underline">tempo</span>, mas pode escolher
          como vai usa-lo
        </div>
      </div>
    </div>
  )
}
