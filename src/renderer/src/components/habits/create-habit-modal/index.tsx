import { useState, useEffect } from 'react'
// @ts-ignore
import colors from 'tailwindcss/colors'

import { Modal } from '@renderer/components/ui'
import { cn } from '@renderer/utils'
import { habitsAtom } from '@renderer/store'
import { useSetAtom } from 'jotai'
import { HabitFrequency } from './habit-frequency'
import { HabitBadge } from './habit-badge'
import { HabitColor } from './habit-color'
import { Input } from '@renderer/components/ui'
import { SelectableHabit } from '@shared/types'

const { db } = window.api

export function CreateHabitModal(): JSX.Element {
  const [habitsWeekdays, setHabitsWeekdays] = useState<string[]>([])
  const [currentBadge, setCurrentBadge] = useState<string | undefined>(undefined)
  const [currentColor, setCurrentColor] = useState<string | undefined>(undefined)
  const [showAllColors, setShowAllColors] = useState(false)

  const [openModal, setOpenModal] = useState(false)

  const [showNameError, setShowNameError] = useState(false)
  const [showWeekdayError, setShowWeekdayError] = useState(false)

  const habits = useSetAtom(habitsAtom)

  useEffect(() => {
    if (!openModal) {
      setCurrentBadge('')
      setCurrentColor('')
      setHabitsWeekdays([])
      setShowWeekdayError(false)
      setShowAllColors(false)
      setShowNameError(false)
    }
  }, [openModal])

  async function createHabit(event: React.FormEvent): Promise<void> {
    event.preventDefault()
    const [habitName, habitDescription] = event.currentTarget.querySelectorAll('input')
    const [name, description] = [habitName.value.trim(), habitDescription.value.trim()]

    if (!name || habitsWeekdays.length == 0) {
      if (!name) {
        setShowNameError(true)
      }

      if (habitsWeekdays.length == 0) {
        setShowWeekdayError(true)
      }

      return
    }

    const data = {
      id: crypto.randomUUID(),
      streak: 0,
      name: name,
      description: description,
      frequency: JSON.stringify(habitsWeekdays),
      badge: currentBadge || '💪',
      color: currentColor || colors.green[500]
    }

    const habit = (await db.habit.create(data)) as SelectableHabit

    habits((prev) => [...prev, habit])
    setOpenModal(false)
  }

  return (
    <Modal
      className="h-[43rem]"
      open={openModal}
      onOpenChange={setOpenModal}
      title="Criar novo hábito"
      trigger={
        <button
          className={cn(
            'rounded-lg bg-green-500 font-sans text-sm font-semibold text-zinc-950 px-2 py-1 cursor-pointer transition-transform active:scale-[93%]'
          )}
        >
          novo hábito
        </button>
      }
    >
      <form onSubmit={createHabit}>
        <div>
          <label htmlFor="habit-name" className="text-lg text-zinc-500/40">
            Nome do hábito
          </label>
          <Input
            errorMessage="opa! esqueceu de dar um nome ao seu hábito"
            showError={showNameError}
            setShowError={setShowNameError}
            name="habit-name"
            id="habit-name"
            type="text"
            placeholder="Eu vou..."
          />
        </div>

        <div className="mt-5">
          <label htmlFor="description" className="text-lg text-zinc-500/40">
            Descrição
          </label>
          <Input
            name="description"
            id="description"
            type="text"
            placeholder="Vou fazer isso porque quero..."
          />
        </div>

        <HabitFrequency
          setShowError={setShowWeekdayError}
          showError={showWeekdayError}
          habitsWeekdays={habitsWeekdays}
          setHabitsWeekdays={setHabitsWeekdays}
        />
        <HabitBadge currentBadge={currentBadge} setCurrentBadge={setCurrentBadge} />
        <HabitColor currentColor={currentColor} setCurrentColor={setCurrentColor} />

        <button
          className="w-full rounded-lg bg-green-500 py-2 text-lg font-bold mt-7 cursor-pointer transition-transform active:scale-[93%]"
          type="submit"
        >
          Criar hábito
        </button>
      </form>
    </Modal>
  )
}
