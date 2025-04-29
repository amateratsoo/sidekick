import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { CursorTextIcon, CheckIcon, EraserIcon } from '@radix-ui/react-icons'
import { PenLineIcon } from 'lucide-react'

import { cn } from '@renderer/utils'
import { useState } from 'react'
import { SelectableTask } from '@shared/types'
import { ActionMenu } from '@renderer/components/ui'
import { EditTaskPopover } from './edit-task-popover'
import type { Action } from '@renderer/components/ui/action-menu'

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
  const [isEditMode, setIsEditMode] = useState(false)
  const [name, setName] = useState(n)
  const [description, setDescription] = useState(d)
  const [isCompleted, setIsCompleted] = useState(is_completed)

  const nameValue = name!.length > 0 ? name : n

  const actions: Action[] = [
    {
      name: 'Editar',
      icon: CursorTextIcon,
      action: () => {
        setName(nameValue)
        setIsEditMode(true)
      },
      className: ''
    },
    { name: 'Apagar', icon: EraserIcon, action: () => {}, className: 'text-red-400' }
  ]

  return (
    <div
      key={id}
      className={cn('flex items-center justify-between', {
        'opacity-25': isCompleted
      })}
    >
      <div
        className="border-l-4 text-base p-2 bg-zinc-950 my-2 text-zinc-300 rounded-md"
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

            <ActionMenu
              actions={actions}
              icon={PenLineIcon}
              triggerClassName="hidden group-hover:grid place-items-center"
            />
          </span>

          <EditTaskPopover
            description={description!}
            setDescription={setDescription}
            name={name!}
            setName={setName}
            isEditMode={isEditMode}
            setIsEditMode={setIsEditMode}
          />
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
