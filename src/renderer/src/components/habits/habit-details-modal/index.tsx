import { type CSSProperties, type SetStateAction, useEffect, useState } from 'react'
import { BlendingModeIcon, CounterClockwiseClockIcon, CursorTextIcon } from '@radix-ui/react-icons'
import { EraserIcon, Flame, PenLineIcon } from 'lucide-react'
import dayjs from 'dayjs'
import { useSetAtom } from 'jotai'

import { habitsAtom } from '@renderer/store'
import { ActionMenu, Modal } from '@renderer/components/ui'
import { cn } from '@renderer/utils'
import { TaskCard } from './task-card'
import { CompletionGraph } from './completion-graph'
import type { HabitAtomProps, SelectableTask } from '@shared/types'
import type { Action } from '@renderer/components/ui/action-menu'
import { EditHabitPopover } from './edit-habit-popover'
import { AlertDialog } from '@renderer/components/ui/alert-dialog'
import { EditHabitColorPopover } from './edit-habit-color-popover'

interface Props extends HabitAtomProps {
  open: boolean
  onOpenChange: (state: SetStateAction<boolean>) => void
}

const { db } = window.api

export function HabitDetailsModal({
  id,
  badge: badgeFromProps,
  color: colorFromProps,
  created_at,
  description: descriptionFromProps,
  frequency: frequencyFromProps,
  name: nameFromProps,
  streak: streakFromProps,
  open,
  onOpenChange,
  completedOn: completedOnFromProps = []
}: Props): JSX.Element | null {
  const [completionGraphMode, setCompletionGraphMode] = useState<'yearly' | 'monthly'>('monthly')
  const setHabits = useSetAtom(habitsAtom)
  const [tasks, setTasks] = useState<SelectableTask[]>([])
  const [habitIsCompleted, setHabitIsCompleted] = useState(false)
  const [initialHabitIsCompleted, setInitialHabitIsCompleted] = useState(false)
  const [completedHabitDates, setCompletedHabitDates] = useState<string[]>([])
  const [initialTasks, setInitialTasks] = useState<SelectableTask[]>([])
  const [loading, setLoading] = useState(true)
  const [openAlertDialog, setOpenAlertDialog] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [isColorEditMode, setIsColorEditMode] = useState(false)

  // Form state
  const [name, setName] = useState(nameFromProps || '')
  const [description, setDescription] = useState(descriptionFromProps || '')
  const [badge, setBadge] = useState(badgeFromProps)
  const [color, setColor] = useState(colorFromProps)
  const [streak, setStreak] = useState(streakFromProps)

  // Computed values
  const nameValue = name.length > 0 ? name : nameFromProps

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        const fetchedTasks = await db.task.findAllByHabitId(id)
        const isCompletedToday = completedOnFromProps.includes(dayjs().format('DD/MM/YYYY'))

        setTasks(fetchedTasks)
        setInitialTasks(fetchedTasks)
        setHabitIsCompleted(isCompletedToday)
        setInitialHabitIsCompleted(isCompletedToday)
        setCompletedHabitDates(completedOnFromProps)
        setLoading(false)
      } catch (error) {
        console.error('Failed to load habit data:', error)
        setLoading(false)
      }
    }

    loadData()
  }, [id, completedOnFromProps])

  // Save changes when modal is closed
  useEffect(() => {
    if (open) return

    const saveChanges = async () => {
      // Save habit changes if needed
      const habitChanged =
        nameFromProps !== name ||
        badgeFromProps !== badge ||
        descriptionFromProps !== description ||
        colorFromProps !== color

      if (habitChanged) {
        await saveHabitChanges()
      }

      // Save task changes if needed
      const tasksChanged = !tasksAreEqual(tasks, initialTasks)
      if (tasksChanged) {
        await saveTaskChanges()
      }

      // Handle habit completion status change
      if (initialHabitIsCompleted !== habitIsCompleted) {
        await updateHabitCompletionStatus()
      }
    }

    saveChanges()
  }, [open])

  // Helper functions
  const tasksAreEqual = (currentTasks: SelectableTask[], originalTasks: SelectableTask[]) => {
    return currentTasks.every((task) => {
      const originalTask = originalTasks.find((t) => t.id === task.id)
      if (!originalTask) return false

      return (
        task.description === originalTask.description &&
        task.name === originalTask.name &&
        task.is_completed === originalTask.is_completed
      )
    })
  }

  const saveHabitChanges = async () => {
    try {
      await db.habit.update({
        id,
        valuesToUpdate: {
          badge,
          color,
          description,
          name
        }
      })

      setHabits((prev) =>
        prev.map((habit) => {
          if (habit.id === id) {
            return {
              ...habit,
              badge,
              color,
              description,
              name,
              streak,
              completedOn: completedHabitDates
            }
          }
          return habit
        })
      )
    } catch (error) {
      console.error('Failed to save habit changes:', error)
    }
  }

  const saveTaskChanges = async () => {
    try {
      const updatePromises = tasks.map((task) =>
        db.task.update({
          id: task.id,
          valuesToUpdate: {
            description: task.description,
            is_completed: task.is_completed ? 1 : 0,
            name: task.name
          }
        })
      )

      await Promise.all(updatePromises)
    } catch (error) {
      console.error('Failed to save task changes:', error)
    }
  }

  const updateHabitCompletionStatus = async () => {
    try {
      setInitialHabitIsCompleted(habitIsCompleted)

      if (habitIsCompleted) {
        await db.habit.check({ habitId: id })
        await db.habit.streak.increase({ habitId: id })
      } else {
        // TODO: Implement a check to see if it's the day to do the habit
        await db.habit.uncheck({ habitId: id })
        await db.habit.streak.decrease({ habitId: id })
      }
    } catch (error) {
      console.error('Failed to update habit completion status:', error)
    }
  }

  // Event handlers
  const deleteHabit = async () => {
    try {
      await db.habit.destroy(id)
      setHabits((prev) => prev.filter((habit) => habit.id !== id))
      setOpenAlertDialog(false)
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to delete habit:', error)
    }
  }

  const toggleHabit = () => {
    const updatedCompletedDates = [...completedHabitDates]
    const today = dayjs().format('DD/MM/YYYY')
    let updatedStreak = streak

    if (!habitIsCompleted) {
      updatedCompletedDates.push(today)
      updatedStreak += 1
    } else {
      const index = updatedCompletedDates.indexOf(today)
      if (index > -1) {
        updatedCompletedDates.splice(index, 1)
      }
      updatedStreak = Math.max(0, updatedStreak - 1)
    }

    setCompletedHabitDates(updatedCompletedDates)
    setStreak(updatedStreak)
    setHabitIsCompleted(!habitIsCompleted)

    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id === id) {
          return {
            ...habit,
            streak: updatedStreak,
            completedOn: updatedCompletedDates
          }
        }
        return habit
      })
    )
  }

  const createTask = async () => {
    try {
      const task = (await db.task.create({
        habit_id: id
      })) as SelectableTask

      setTasks((prev) => [...prev, task])
    } catch (error) {
      console.error('Failed to create task:', error)
    }
  }

  // Menu & items definitions
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
      name: 'Aparência',
      icon: BlendingModeIcon,
      action: () => setIsColorEditMode(true)
    },
    {
      name: 'Apagar',
      icon: EraserIcon,
      action: () => setOpenAlertDialog(true),
      className: 'text-red-400'
    }
  ]

  const progressSectionItems = [
    { name: 'ofensiva', value: streak, icon: Flame },
    {
      name: 'começou em',
      value: dayjs(created_at).format('DD/MM/YYYY'),
      icon: CounterClockwiseClockIcon
    }
  ]

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
        <div className="-space-y-1.5 text-left w-full">
          <span className="block text-zinc-500/20 text-lg font-bold font-serif">Eu vou</span>
          <div className="flex">
            <div className="group flex">
              <p className="text-zinc-300 font-bold font-sans text-xl w-fit max-w-[19rem] truncate">
                {nameValue}
              </p>
              <ActionMenu
                actions={actions}
                trigger={<PenLineIcon className="size-3.5" />}
                side="bottom"
                triggerClassName="hidden group-hover:grid place-items-center"
                anchored
              />
              <EditHabitPopover
                badge={badge}
                setBadge={setBadge}
                description={description}
                setDescription={setDescription}
                isEditMode={isEditMode}
                setIsEditMode={setIsEditMode}
                name={name}
                setName={setName}
              />
              <EditHabitColorPopover
                id={id}
                color={color}
                setColor={setColor}
                name={name}
                badge={badge}
                isColorEditMode={isColorEditMode}
                setIsColorEditMode={setIsColorEditMode}
              />
            </div>
            <button
              data-habit-is-completed={habitIsCompleted}
              title={`${habitIsCompleted ? 'desmarcar' : 'marcar'} tarefa`}
              className="rounded-lg ring-2 cursor-pointer size-6 ml-auto -mt-1"
              style={
                {
                  '--tw-ring-color': habitIsCompleted ? color : 'var(--color-zinc-600)'
                } as CSSProperties
              }
              onClick={toggleHabit}
            >
              {habitIsCompleted && (
                <div className="rounded size-4 m-auto" style={{ backgroundColor: color }} />
              )}
            </button>
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
                  'bg-zinc-900': completionGraphMode === 'monthly'
                })}
              >
                mensal
              </button>
              <button
                onClick={() => setCompletionGraphMode('yearly')}
                className={cn('p-1 px-2 cursor-pointer rounded-md', {
                  'bg-zinc-900': completionGraphMode === 'yearly'
                })}
              >
                anual
              </button>
            </div>
          </div>

          <CompletionGraph
            mode={completionGraphMode}
            completedHabitDates={completedHabitDates}
            color={color}
          />
        </section>

        <section className="mt-2">
          <h2 className="text-zinc-300 font-sans font-semibold text-xl mb-4">Tarefas</h2>
          <div>
            {tasks.map((task) => (
              <TaskCard {...task} setTasks={setTasks} color={color} key={task.id} />
            ))}
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
        </section>
      </div>

      <AlertDialog
        actions={[
          { name: 'Cancelar', action: () => setOpenAlertDialog(false) },
          {
            name: 'Apagar',
            className: 'bg-red-500 text-red-300',
            action: deleteHabit
          }
        ]}
        open={openAlertDialog}
        onOpenChange={setOpenAlertDialog}
        title="Deseja mesmo apagar o hábito?"
        titleClassName="text-xl"
        description="Esta ação é irreversível"
        descriptionClassName="text-zinc-600"
      />
    </Modal>
  )
}
