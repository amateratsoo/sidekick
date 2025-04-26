import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { CursorTextIcon, CheckIcon } from '@radix-ui/react-icons'
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
  description: d,
  habit_id,
  id,
  is_completed,
  name: n,
  color
}: Props) {
  const [name, setName] = useState(n)
  const [description, setDescription] = useState(d)
  const [isCompleted, setIsCompleted] = useState(is_completed)

  const nameValue = name!.length > 0 ? name : n

  return (
    <div
      key={id}
      className={cn('flex items-center justify-between', {
        'opacity-25': isCompleted
      })}
    >
      <div
        className="border-l-4 text-base p-2 bg-zinc-950 my-2 text-zinc-300 rounded-md"
        // supports oklch and hex colors, feels like fixing with
        style={{ borderColor: color }}
      >
        <span className="group">
          <span className="flex">
            <span className="relative w-fit flex">
              <p className="text-zinc-500 font-serif text-xl font-semibold mb-1 inline-block w-fit max-w-80 truncate">
                {nameValue}
              </p>

              {isCompleted && (
                <div className="absolute w-full bg-zinc-300 h-px top-1/2 -translate-y-1/2" />
              )}
            </span>

            <Popover.Root>
              <Popover.Trigger asChild>
                <button
                  className="rounded-md cursor-pointer hidden group-hover:grid place-items-center h-fit w-fit p-1 bg-zinc-900/60 border border-zinc-800 ml-2.5"
                  onClick={() => {
                    setName(nameValue)
                  }}
                >
                  <CursorTextIcon />
                </button>
              </Popover.Trigger>
              <Popover.Anchor />
              <Popover.Portal>
                <Popover.Content
                  align="center"
                  side="top"
                  sideOffset={10}
                  className="bg-zinc-950 rounded-lg"
                >
                  <div className="rounded-lg bg-zinc-950 border border-zinc-900 shadow-zinc-900/40 shadow-2xl w-72 h-fit">
                    <div className="bg-zinc-900/50 rounded-lg">
                      <Input
                        className="w-full rounded-b-none rounded-t-lg m-0 outline-none focus:ring-2 focus:ring-zinc-600 bg-transparent pr-2 placeholder:text-zinc-600"
                        value={name}
                        onChange={({ target }) => setName(target.value)}
                        placeholder="Pense em um nome criativo"
                      />

                      <textarea
                        className="w-full min-h-24 text-zinc-300 p-2 outline-none ring-0 ring-zinc-600 focus:ring-2 custom-scrollbar overflow-x-hidden placeholder:text-center placeholder:text-sm placeholder:font-sans placeholder:text-zinc-600 field-sizing-content bg-transparent h-full"
                        onChange={({ target }) => setDescription(target.value)}
                        placeholder="Use markdown ou texto simples para descrever a tarefa ✎𓂃"
                        value={description || ''}
                      />
                    </div>
                  </div>
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          </span>
        </span>

        <div className="w-96 max-w-96 prose prose-zinc lg:prose-lg dark:prose-invert">
          <Markdown remarkPlugins={[remarkGfm]}>{description}</Markdown>
        </div>
      </div>

      <button
        className="rounded-lg bg-zinc-900/60 size-7 flex items-center justify-center cursor-pointer self-start mt-3.5"
        role="checkbox"
        onClick={() => setIsCompleted((prev) => !prev)}
      >
        {isCompleted && <CheckIcon className="size-5" />}
      </button>
    </div>
  )
}
