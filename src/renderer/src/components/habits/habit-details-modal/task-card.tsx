import { cn } from '@renderer/utils'
import { SelectableTask } from '@shared/types'

interface Props extends SelectableTask {
  color: string
}

export function TaskCard({
  created_at,
  description,
  habit_id,
  id,
  is_completed,
  name,
  color
}: Props) {
  return (
    <div
      key={id}
      className={cn('flex items-center justify-between', {
        'opacity-25': is_completed
      })}
    >
      <div
        className="border-l-4 text-base p-2 bg-zinc-950 my-2 text-zinc-300 rounded-md"
        style={{ borderColor: color }}
      >
        <span className="relative">
          <p
            className={cn('text-zinc-500 font-serif text-xl font-semibold mb-1 inline-block', {
              '': is_completed == true
            })}
          >
            {name}
          </p>

          {is_completed && (
            <div className="absolute w-full bg-zinc-300 h-px top-1/2 -translate-y-1/2" />
          )}
        </span>
        <div>
          <p className="text-zinc-300">{description}</p>
        </div>
      </div>

      <div>
        <input
          type="checkbox"
          className="size-6 rounded-md bg-zinc-900"
          defaultChecked={is_completed}
        />
      </div>
    </div>
  )
}
