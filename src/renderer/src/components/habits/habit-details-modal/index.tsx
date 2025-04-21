import { type SetStateAction, useEffect, useState } from 'react'
import dayjs from 'dayjs'

import { ScrollArea, Modal } from '@renderer/components/ui'
import { cn } from '@renderer/utils'
import { TaskCard } from './task-card'

import type { InsertableTask, SelectableHabit, SelectableTask } from '@shared/types'

import { getAllDaysOfTheYear } from '@renderer/utils/get-all-days-of-the-year'

interface Props extends SelectableHabit {
  open: boolean
  onOpenChange: (state: SetStateAction<boolean>) => void
}

const allDaysOfTheYear = getAllDaysOfTheYear()

export function HabitDetailsModal({
  badge,
  color,
  created_at,
  description,
  frequency,
  id,
  name,
  streak,
  tasks: t = [],
  open,
  onOpenChange
}: Props): JSX.Element {
  const [completionGraphMode, setCompletionGraphMode] = useState<'yearly' | 'monthly'>('monthly')
  const [tasks, setTasks] = useState(t)

  useEffect(() => {
    return () => setTasks([])
  }, [])

  const { db } = window.api

  async function createTask() {
    const task = await db.task.createTask({
      habit_id: id
    })

    setTasks((prev) => [...prev, task])
  }

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
          <p className="text-zinc-300 font-bold font-sans text-xl line-clamp-1">{name}</p>
        </div>
      </header>

      {description && (
        <div
          className="border-l-4 text-base p-2 bg-zinc-900/60 my-6 text-zinc-300 rounded-md"
          style={{ borderColor: color }}
        >
          <p className="text-zinc-500 font-serif text-xl font-semibold mb-1">
            🧠 Vou fazer isso porque quero
          </p>
          <div>
            <p className="text-zinc-300 pl-8">{description}</p>
          </div>
        </div>
      )}

      <div className="mt-5">
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
        <ScrollArea className="w-[calc(100%+0.4rem)] overflow-x-scroll pb-2">
          {completionGraphMode == 'monthly' ? (
            <div className="flex min-w-[calc(100%+60rem)] gap-12">
              {allDaysOfTheYear.map((month, monthIndex) => {
                const monthName = dayjs().localeData().months()[monthIndex]
                const index = monthIndex > 0 ? monthIndex : getAllDaysOfTheYear().length - 1
                const daysOfLastMonth = getAllDaysOfTheYear()[index - 1]
                const dayOfTheWeekMonthStarted = dayjs(
                  `${dayjs().year()}-${monthIndex + 1}-1`
                ).day()
                const d = [
                  daysOfLastMonth.splice(
                    daysOfLastMonth.length - dayOfTheWeekMonthStarted,
                    dayOfTheWeekMonthStarted
                  ),
                  month
                ]

                return (
                  <div key={monthName} className="">
                    <h3 className="text-zinc-500 font-semibold font-sans mb-3">{monthName}</h3>
                    <div className="grid grid-cols-7 gap-x-[1.54rem] gap-y-1.5">
                      {d.map((month, dMonthIndex) => {
                        return month.map((day, dayIndex) => {
                          return (
                            <div
                              key={`${day}-${monthIndex}-${dayIndex}`}
                              className={cn('size-5 mx-auto rounded-md bg-zinc-900', {
                                'ring-2 ring-zinc-800':
                                  day == dayjs().date() &&
                                  monthIndex == dayjs().month() &&
                                  dMonthIndex == 1,
                                'opacity-40': dMonthIndex == 0
                              })}
                            />
                          )
                        })
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="w-[calc(100%+60rem)] flex flex-wrap gap-1">
              {allDaysOfTheYear.map((month, monthIndex) => {
                return month.map((day) => {
                  return (
                    <div
                      key={day}
                      className={cn('size-5 rounded-md bg-zinc-900', {
                        'ring-2 ring-zinc-800':
                          monthIndex == dayjs().month() && day == dayjs().date()
                      })}
                    />
                  )
                })
              })}
            </div>
          )}
        </ScrollArea>

        {/* <div>
          <h3>Desde 22/03/2024</h3>
        </div> */}

        <div>
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
        </div>
      </div>
    </Modal>
  )
}
