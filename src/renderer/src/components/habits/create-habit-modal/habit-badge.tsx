import { useRef, type SetStateAction } from 'react'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'

import { EmojiPicker } from '@renderer/components/ui'
import { cn } from '@renderer/utils'

interface Props {
  currentBadge?: string
  setCurrentBadge: (state: SetStateAction<string | undefined>) => void
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
          return (
            <button
              type="button"
              onClick={() => {
                if (currentBadge == badge) {
                  setCurrentBadge('')
                  return
                }
                setCurrentBadge(badge)
              }}
              key={badge}
              className={cn(
                'rounded-full text-zinc-300 border border-zinc-900 px-2.5 py-[2.8px] cursor-pointer',
                {
                  'bg-zinc-800 text-zinc-950': currentBadge == badge
                }
              )}
            >
              {badge}
            </button>
          )
        })}

        <EmojiPicker onEmojiSelect={setCurrentBadge}>
          <button
            type="button"
            className={cn(
              'rounded-full text-zinc-300 border border-zinc-900 px-2.5 h-8 cursor-pointer group hover:bg-green-500'
            )}
          >
            <DotsHorizontalIcon className="stroke-green-500 group-hover:stroke-green-800 group-hover:text-green-800" />
          </button>
        </EmojiPicker>
      </div>
    </div>
  )
}
