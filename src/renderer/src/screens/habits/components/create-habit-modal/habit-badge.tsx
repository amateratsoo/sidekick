import { DotsHorizontalIcon, PinLeftIcon } from '@radix-ui/react-icons'

import { cn } from '@renderer/utils'

interface Props {
  showAllEmojis: boolean
  setShowAllEmojis: (state: React.SetStateAction<boolean>) => void
  currentBadge?: string
  setCurrentBadge: (state: React.SetStateAction<string | undefined>) => void
}

const emojis = ['🏋️‍♀️', '🍎', '💡', '😮‍💨', '🌍', '🔑', '😱', '📍', '🎹', '📖', '🎸']

export function HabitBadge({
  showAllEmojis,
  setShowAllEmojis,
  currentBadge,
  setCurrentBadge
}: Props): JSX.Element {
  return (
    <div className="mt-5">
      <label htmlFor="" className="text-lg text-zinc-500/40">
        Emblema
      </label>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {emojis.map((badge, index) => {
          if (!showAllEmojis && index >= 7) return

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

        <button
          type="button"
          onClick={() => setShowAllEmojis((prev) => !prev)}
          className={cn(
            'rounded-full text-zinc-300 border border-zinc-900 px-2.5 py-[2.8px] cursor-pointer group hover:bg-green-500'
          )}
        >
          {showAllEmojis ? (
            <PinLeftIcon className="stroke-green-500 group-hover:stroke-green-800" />
          ) : (
            <DotsHorizontalIcon className="stroke-green-500 group-hover:stroke-green-800 group-hover:text-green-800" />
          )}
        </button>
      </div>
    </div>
  )
}
