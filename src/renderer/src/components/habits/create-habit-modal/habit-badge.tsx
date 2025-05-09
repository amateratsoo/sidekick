import { useRef, type SetStateAction } from 'react'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'

import { EmojiPicker } from '@renderer/components/ui'
import { cn } from '@renderer/utils'

interface Props {
  currentBadge?: string
  setCurrentBadge: (state: SetStateAction<string>) => void
}

export function HabitBadge({ currentBadge, setCurrentBadge }: Props): JSX.Element {
  const emojis = useRef(['🏋️‍♀️', '🔑', '😱', '📍', '🎹', '📖', '🎸'])

  return (
    <div className="mt-5">
      <label htmlFor="" className="text-lg text-zinc-500/40">
        Emblema
      </label>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {emojis.current.map((badge) => {
          const isSelected = currentBadge === badge

          return (
            <button
              type="button"
              onClick={() => {
                if (isSelected) {
                  setCurrentBadge('')
                  return
                }
                setCurrentBadge(badge)
              }}
              data-is-selected={isSelected}
              key={badge}
              className="data-[is-selected=true]:bg-zinc-800 data-[is-selected=true]:text-zinc-950 hover:scale-105 hover:bg-zinc-900 -hover:rotate-3 transition-transform [transition-timing-function:var(--transition-snappy)] rounded-full text-zinc-300 border border-zinc-900 px-2.5 py-[2.8px]"
            >
              {badge}
            </button>
          )
        })}

        <EmojiPicker onEmojiSelect={setCurrentBadge}>
          <button
            type="button"
            className="rounded-full text-zinc-300 border border-zinc-900 px-2.5 h-8 group hover:bg-green-500"
          >
            <DotsHorizontalIcon className="stroke-green-500 group-hover:stroke-green-800 group-hover:text-green-800" />
          </button>
        </EmojiPicker>
      </div>
    </div>
  )
}
