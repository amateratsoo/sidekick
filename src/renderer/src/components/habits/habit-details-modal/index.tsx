import { type SetStateAction, useEffect, useState } from 'react'
import {
  BlendingModeIcon,
  CounterClockwiseClockIcon,
  CursorTextIcon,
  OpacityIcon,
  ShadowInnerIcon
} from '@radix-ui/react-icons'

import { ActionMenu, Modal } from '@renderer/components/ui'
import { cn } from '@renderer/utils'
import { TaskCard } from './task-card'
import { CompletionGraph } from './completion-graph'

import type { SelectableHabit, SelectableTask } from '@shared/types'
import type { Action } from '@renderer/components/ui/action-menu'
import dayjs from 'dayjs'
import { EraserIcon, Flame, PenLineIcon } from 'lucide-react'
import { EditHabitPopover } from './edit-habit-popover'

interface Props extends SelectableHabit {
  open: boolean
  onOpenChange: (state: SetStateAction<boolean>) => void
}

export function HabitDetailsModal({
  badge: b,
  color,
  created_at,
  description: d,
  frequency,
  id,
  name: n,
  streak,
  open,
  onOpenChange
}: Props): JSX.Element | null {
  const progressSectionItems = [
    { name: 'ofensiva', value: streak, icon: Flame },
    {
      name: 'começou em',
      value: dayjs(created_at).format('DD/MM/YYYY'),
      icon: CounterClockwiseClockIcon
    }
  ]

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
    { name: 'Aparência', icon: ShadowInnerIcon, className: '', action: () => {} },
    { name: 'Apagar', icon: EraserIcon, action: () => {}, className: 'text-red-400' }
  ]

  const [completionGraphMode, setCompletionGraphMode] = useState<'yearly' | 'monthly'>('monthly')
  const [tasks, setTasks] = useState<SelectableTask[]>([])
  const [loading, setLoading] = useState(true)

  const [isEditMode, setIsEditMode] = useState(false)
  const [name, setName] = useState(n || '')
  const [description, setDescription] = useState(d)
  const [badge, setBadge] = useState(b)

  const nameValue = name!.length > 0 ? name : n

  const { db } = window.api

  useEffect(() => {
    ;(async () => {
      const tasks = await db.task.findAllByHabitId({ habitId: id })
      setTasks(tasks)

      setLoading(false)
    })()
  }, [])

  async function createTask() {
    const task = await db.task.createTask({
      habit_id: id
    })

    setTasks((prev) => [...prev, task])
  }

  if (loading) return null

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      trigger={null}
      className="h-[50rem] text-zinc-300"
      scrollAreaClassName="overflow-x-hidden"
    >
      <header className="w-full -mt-6 flex items-center gap-2">
        <div className="rounded-lg p-2 bg-zinc-900/60 text-2xl aspect-square">{badge}</div>
        <div className="-space-y-1.5 text-left">
          <span className="block text-zinc-500/20 text-lg font-bold font-serif">Eu vou</span>
          <div className="group flex">
            <p className="text-zinc-300 font-bold font-sans text-xl line-clamp-1">{nameValue}</p>
            <ActionMenu
              actions={actions}
              icon={PenLineIcon}
              side="bottom"
              triggerClassName="hidden group-hover:grid place-items-center"
            />

            <EditHabitPopover
              badge={badge}
              setBadge={setBadge}
              description={description!}
              setDescription={setDescription}
              isEditMode={isEditMode}
              setIsEditMode={setIsEditMode}
              name={name}
              setName={setName}
            />
          </div>
        </div>
      </header>

      {description && (
        <article
          className="border-l-4 text-base p-2 bg-zinc-900/60 my-6 text-zinc-300 rounded-md"
          style={{ borderColor: color }}
        >
          <p className="text-zinc-500 font-serif text-xl font-semibold mb-1">
            🧠 Vou fazer isso porque quero
          </p>
          <div>
            <p className="text-zinc-300 pl-8">{description}</p>
          </div>
        </article>
      )}

      <div className="mt-5">
        <section>
          <div className="w-full flex justify-between items-start">
            <h2 className="text-zinc-300 font-sans font-semibold text-xl mb-4">Visão geral</h2>
            <div className="text-zinc-500 border border-zinc-900 bg-zinc-900/20 rounded-lg text-xs p-[0.10rem]">
              <button
                onClick={() => setCompletionGraphMode('monthly')}
                className={cn('p-1 px-2 cursor-pointer rounded-md', {
                  'bg-zinc-900': completionGraphMode == 'monthly'
                })}
              >
                mensal
              </button>
              <button
                onClick={() => setCompletionGraphMode('yearly')}
                className={cn('p-1 px-2 cursor-pointer rounded-md', {
                  'bg-zinc-900': completionGraphMode == 'yearly'
                })}
              >
                anual
              </button>
            </div>
          </div>
          <CompletionGraph mode={completionGraphMode} />
        </section>
        <section className="mt-2">
          <h2 className="text-zinc-300 font-sans font-semibold text-xl mb-4">Tarefas</h2>
          <div>
            {tasks.map((task) => {
              return <TaskCard {...task} color={color} key={task.id} />
            })}
            <button
              className="rounded-lg p-2 cursor-pointer text-center w-full border-dashed border-2 border-zinc-500/30 text-zinc-500/50 transition-transform active:scale-95 text-sm mt-4"
              onClick={createTask}
            >
              adicionar nova tarefa 🪄
            </button>
          </div>
        </section>
        <section className="mt-8">
          <h2 className="text-zinc-300 font-sans font-semibold text-xl my-4">Progresso</h2>
          <div className="grid grid-cols-2 gap-4">
            {progressSectionItems.map((item) => {
              const Icon = item.icon

              return (
                <article
                  className="border border-zinc-900 rounded-lg px-2.5 py-2 pt-1 w-full border-b-4"
                  key={item.name}
                >
                  <div className="text-lg font-medium flex items-center gap-x-1">
                    {Icon && <Icon className="size-4 text-zinc-400" />}
                    {String(item.value)}
                  </div>
                  <div className="text-zinc-500 text-sm">{item.name}</div>
                </article>
              )
            })}
          </div>
        </section>{' '}
      </div>
    </Modal>
  )
}
