import { CursorTextIcon } from '@radix-ui/react-icons'
import * as Popover from '@radix-ui/react-popover'

import { cn } from '@renderer/utils'
import { useState } from 'react'
import { SelectableTask } from '@shared/types'
import { Input } from '@renderer/components/ui'

interface Props extends SelectableTask {
  color: string
}

export function TaskCard({
  created_at,
  description,
  habit_id,
  id,
  is_completed,
  name: n,
  color
}: Props) {
  const [name, setName] = useState(n)
  const [editMode, setEditMode] = useState(false)

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
        <span className="relative group">
          <span className="flex">
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

            <Popover.Root>
              <Popover.Trigger asChild>
                <button
                  className="rounded-md cursor-pointer hidden group-hover:inline border border-zinc-800 bg-zinc-900 p-1 px-2 hover:brightness-105 ml-2.5"
                  onClick={() => setEditMode((prev) => !prev)}
                >
                  <CursorTextIcon className="size-4" />
                </button>
              </Popover.Trigger>
              <Popover.Anchor />
              <Popover.Portal>
                <Popover.Content
                  align="center"
                  side="bottom"
                  sideOffset={8}
                  className="bg-zinc-950"
                >
                  <Input
                    className="px-2 bg-zinc-900/15 text-base py-1 ml-9 pl-2.5 ring-1 ring-zinc-800 text-zinc-300 outline-none focus-within:ring-zinc-300 rounded-md w-fit mt-1"
                    value={name}
                    onChange={({ target }) => setName(target.value)}
                  />
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          </span>
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
