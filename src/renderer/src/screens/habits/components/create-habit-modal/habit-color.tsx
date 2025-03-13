import { DotsHorizontalIcon, PinLeftIcon } from '@radix-ui/react-icons'

// @ts-ignore - colors exists inside the tailwind module
import c from 'tailwindcss/colors'
import { cn } from '@renderer/utils'

interface Props {
  showAllColors: boolean
  setShowAllColors: (state: React.SetStateAction<boolean>) => void
  currentColor?: string
  setCurrentColor: (state: React.SetStateAction<string | undefined>) => void
}

const colors = [
  c.amber[500],
  c.blue[500],
  c.green[500],
  c.slate[500],
  c.gray[500],
  c.rose[500],
  c.cyan[500],
  c.emerald[500],
  c.red[500],
  c.white,
  c.black,
  c.violet[500],
  c.indigo[500],
  c.orange[500],
  c.yellow[500],
  c.sky[500]
]

export function HabitColor({
  currentColor,
  setCurrentColor,
  setShowAllColors,
  showAllColors
}: Props): JSX.Element {
  return (
    <div className="mt-5">
      <label htmlFor="" className="text-lg text-zinc-500/40">
        Cor
      </label>
      <div className="mt-3 flex flex-wrap gap-1.5 items-center">
        {colors.map((color, index) => {
          if (!showAllColors && index >= 7) return

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
                'rounded-full border border-zinc-900 w-9 h-6 text-transparent cursor-pointer',
                {
                  'ring-zinc-500 ring-2': currentColor == color
                }
              )}
              style={{ backgroundColor: color }}
            ></button>
          )
        })}

        <button
          type="button"
          onClick={() => setShowAllColors((prev) => !prev)}
          className={cn(
            'rounded-full text-zinc-300 border border-zinc-900 px-2.5 py-1.5 cursor-pointer group hover:bg-green-500'
          )}
        >
          {showAllColors ? (
            <PinLeftIcon className="stroke-green-500 group-hover:stroke-green-800" />
          ) : (
            <DotsHorizontalIcon className="stroke-green-500 group-hover:text-green-800 group-hover:stroke-green-800" />
          )}
        </button>
      </div>
    </div>
  )
}
