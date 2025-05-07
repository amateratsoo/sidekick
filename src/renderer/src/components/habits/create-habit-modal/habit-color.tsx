import type { SetStateAction } from 'react'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'

import { cn } from '@renderer/utils'
import { ColorPicker } from '@renderer/components/ui'

interface Props {
  currentColor?: string
  setCurrentColor: (state: SetStateAction<string | undefined>) => void
}

const colors = [
  '#f59e0b', // amber
  '#3b82f6', // blue
  '#22c55e', // green
  '#6366f1', // indigo
  '#6b7280', // gray
  '#f43f5e', // rose
  '#06b6d4', // cyan
  '#ef4444' // red
]

export function HabitColor({ currentColor, setCurrentColor }: Props): JSX.Element {
  return (
    <div className="mt-5">
      <label htmlFor="" className="text-lg text-zinc-500/40">
        Aparência
      </label>
      <div className="mt-3 flex flex-wrap gap-1.5 items-center">
        {colors.map((color) => {
          return (
            <button
              type="button"
              onClick={() => {
                if (currentColor == color) {
                  setCurrentColor('')
                  return
                }
                setCurrentColor(color)
              }}
              key={color}
              className={cn(
                'rounded-full border-2 border-zinc-950 w-9 h-6 text-transparent cursor-pointer',
                {
                  'ring-zinc-500/50 ring-2': currentColor == color
                }
              )}
              style={{ backgroundColor: color }}
            ></button>
          )
        })}

        <ColorPicker
          handleColorChange={setCurrentColor}
          default_value={currentColor ? currentColor : undefined}
        >
          <button
            type="button"
            className="rounded-full text-zinc-300 border border-zinc-900 px-2.5 py-1.5 cursor-pointer group hover:bg-green-500"
          >
            <DotsHorizontalIcon className="stroke-green-500 group-hover:text-green-800 group-hover:stroke-green-800" />
          </button>
        </ColorPicker>
      </div>
    </div>
  )
}
