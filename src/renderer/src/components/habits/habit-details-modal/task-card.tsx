import { type SetStateAction, useEffect, useState } from 'react'

import { useSetAtom } from 'jotai'

import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'

import { CursorTextIcon, CheckIcon, EraserIcon } from '@radix-ui/react-icons'
import { PenLineIcon } from 'lucide-react'

import type { Action } from '@renderer/components/ui/action-menu'
import { cn } from '@renderer/utils'
import type { SelectableTask } from '@shared/types'
import { ActionMenu } from '@renderer/components/ui'
import { EditTaskPopover } from './edit-task-popover'
import { AlertDialog } from '@renderer/components/ui/alert-dialog'
import { currentTasksAtom } from '@renderer/store'

interface Props extends SelectableTask {
  color: string
  setTasks: (state: SetStateAction<SelectableTask[]>) => void
}

const { db } = window.api

export function TaskCard({
  created_at,
  description: descriptionFromProps,
  habit_id,
  id,
  is_completed,
  name: nameFromProps,
  color,
  setTasks
}: Props) {
  const [openAlertDialog, setOpenAlertDialog] = useState(false)

  const currentTasks = useSetAtom(currentTasksAtom)
  const [isEditMode, setIsEditMode] = useState(false)
  const [name, setName] = useState(nameFromProps)
  const [description, setDescription] = useState(descriptionFromProps)
  const [isCompleted, setIsCompleted] = useState(is_completed)

  const nameValue = name!.length > 0 ? name : nameFromProps

  const actions: Action[] = [
    {
      name: 'Editar',
      icon: CursorTextIcon,
      action: () => {
        setName(nameValue)
        setIsEditMode(true)
      }
    },
    {
      name: 'Apagar',
      icon: EraserIcon,
      action: () => setOpenAlertDialog(true),
      className: 'text-red-400'
    }
  ]

  async function deleteTask() {
    await db.task.destroy(id)
    setTasks((prev) => prev.filter((task) => task.id != id))
    setOpenAlertDialog(false)
  }

  function checkTask() {
    setIsCompleted((prev) => {
      // find the task with the same id and change
      // the is_completed status
      // then reflect the changes on the ui
      currentTasks((t) => {
        return t.map((task) => {
          if (task.id == id) {
            return {
              ...task,
              is_completed: !prev
            }
          }

          return task
        })
      })

      return !prev
    })
  }

  useEffect(() => {
    // note: when i click off the modal,
    // in the overlay for example
    // the state is not saved
    if (!isEditMode) {
      currentTasks((prev) => {
        return prev.map((task) => {
          if (task.id == id) {
            return {
              created_at,
              description,
              habit_id,
              id,
              is_completed,
              name
            }
          }

          return task
        })
      })
    }
  }, [isEditMode])

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
          <Markdown rehypePlugins={[rehypeHighlight]} remarkPlugins={[remarkGfm]}>
            {description}
          </Markdown>
        </div>
      </div>

      <button
        className="rounded-lg bg-zinc-900/60 size-7 flex items-center justify-center cursor-pointer self-start mt-3.5"
        role="checkbox"
        onClick={checkTask}
      >
        {isCompleted && <CheckIcon className="size-5" />}
      </button>

      <AlertDialog
        actions={[
          { name: 'Cancelar', action: () => setOpenAlertDialog(false) },
          { name: 'Apagar', className: 'bg-red-500 text-red-300', action: () => deleteTask() }
        ]}
        open={openAlertDialog}
        onOpenChange={setOpenAlertDialog}
        title="Deseja mesmo apagar a tarefa?"
        titleClassName="text-xl"
        description="Esta ação é irreversível"
        descriptionClassName="text-zinc-600"
      />
    </div>
  )
}
