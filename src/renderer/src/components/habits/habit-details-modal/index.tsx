import { type SetStateAction, useEffect, useState } from 'react'
import {
  CounterClockwiseClockIcon,
  CursorTextIcon,
  Pencil2Icon,
  Pencil1Icon
} from '@radix-ui/react-icons'

import { ColorPicker, EmojiPicker, Input, Modal, Popover } from '@renderer/components/ui'
import { cn } from '@renderer/utils'
import { TaskCard } from './task-card'
import { CompletionGraph } from './completion-graph'

import type { SelectableHabit, SelectableTask } from '@shared/types'
import dayjs from 'dayjs'
import { Flame, Pen } from 'lucide-react'

interface Props extends SelectableHabit {
  open: boolean
  onOpenChange: (state: SetStateAction<boolean>) => void
}

export function HabitDetailsModal({
  badge: b,
  color: c,
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
  const [completionGraphMode, setCompletionGraphMode] = useState<'yearly' | 'monthly'>('monthly')
  const [tasks, setTasks] = useState<SelectableTask[]>([])
  const [loading, setLoading] = useState(true)

  const [name, setName] = useState(n || '')
  const [description, setDescription] = useState(d)
  const [badge, setBadge] = useState(b)
  const [color, setColor] = useState(c)

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
            <Popover
              align="center"
              side="top"
              sideOffset={10}
              trigger={
                <button
                  className="rounded-md cursor-pointer hidden group-hover:grid place-items-center h-fit w-fit p-1 bg-zinc-900/60 border border-zinc-800 ml-2.5"
                  onClick={() => setName(nameValue)}
                >
                  <Pen className="size-3.5" />
                </button>
              }
              className="bg-zinc-950 rounded-lg"
            >
              <div className="rounded-lg bg-zinc-950 border border-zinc-900 shadow-zinc-900/40 shadow-2xl w-96 h-fit flex">
                <div className="p-4 flex items-center justify-center">
                  <EmojiPicker onEmojiSelect={setBadge}>
                    <button className="rounded-lg p-2 bg-zinc-900/60 text-2xl aspect-square cursor-pointer">
                      {badge}
                    </button>
                  </EmojiPicker>

                  {/* <ColorPicker default_value={c} handleColorChange={setColor}>
                    <button
                      className="rounded-lg p-2 bg-zinc-900/60 text-2xl aspect-square cursor-pointer"
                      style={{ backgroundColor: color }}
                    />
                  </ColorPicker> */}
                </div>
                <div className="bg-zinc-900/50 rounded-r-lg">
                  <Input
                    className="w-full rounded-none rounded-tr-lg m-0 outline-none focus:ring-2 focus:ring-zinc-600 bg-transparent pr-2 placeholder:text-zinc-600"
                    value={name}
                    onChange={({ target }) => setName(target.value)}
                    placeholder="Pense em um nome criativo"
                  />

                  <Input
                    className="w-full rounded-none rounded-br-lg m-0 outline-none focus:ring-2 focus:ring-zinc-600 bg-transparent pr-2 placeholder:text-zinc-600 text-zinc-300"
                    onChange={({ target }) => setDescription(target.value)}
                    placeholder="𖣠 vou fazer isso porque quero..."
                    value={description || ''}
                  />
                </div>
              </div>
            </Popover>
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
