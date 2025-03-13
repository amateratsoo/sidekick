import { useState, useEffect } from 'react'
// @ts-ignore (module `colors` exists in `tailwindcss`)
import c from 'tailwindcss/colors'

import { Modal } from '@renderer/components/modal'
import { cn } from '@renderer/utils'
import { habitsAtom } from '@renderer/store'
import { useSetAtom } from 'jotai'
import { HabitFrequency } from './habit-frequency'
import { HabitBadge } from './habit-badge'
import { HabitColor } from './habit-color'

const { db } = window.api

export function CreateHabitModal(): JSX.Element {
  const [habitsWeekdays, setHabitsWeekdays] = useState<string[]>([])
  const [currentBadge, setCurrentBadge] = useState<string | undefined>(undefined)
  const [currentColor, setCurrentColor] = useState<string | undefined>(undefined)
  const [showAllColors, setShowAllColors] = useState(false)
  const [showAllEmojis, setShowAllEmojis] = useState(false)

  const [openModal, setOpenModal] = useState(false)

  const habits = useSetAtom(habitsAtom)

  useEffect(() => {
    if (!openModal) {
      setCurrentBadge('')
      setCurrentColor('')
      setHabitsWeekdays([])
      setShowAllColors(false)
      setShowAllEmojis(false)
    }
  }, [openModal])

  async function createHabit(event: React.FormEvent): Promise<void> {
    event.preventDefault()
    const [habitName, habitDescription] = event.currentTarget.querySelectorAll('input')
    const [name, description] = [
      habitName.value.trim(),
      habitDescription.value.trim()
      // habitDescription.value.length > 0 ? habitDescription.value.trim() : undefined
    ]

    if (!name || habitsWeekdays.length == 0) return

    const data = {
      id: crypto.randomUUID(),
      streak: 0,
      name: name,
      description: description,
      frequency: JSON.stringify(habitsWeekdays),
      badge: currentBadge || '💪',
      color: currentColor || (c.blue[500] as string)
    }

    const habit = await db.habit.createHabit(data)

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
          <input
            name="habit-name"
            id="habit-name"
            type="text"
            placeholder="Eu vou..."
            className="block bg-zinc-900/15 py-3 pl-2.5 ring-1 ring-zinc-800 text-zinc-300 outline-none focus-within:ring-zinc-300 rounded-md w-full mt-3"
          />
        </div>

        <div className="mt-5">
          <label htmlFor="description" className="text-lg text-zinc-500/40">
            Descrição
          </label>
          <input
            name="description"
            id="description"
            type="text"
            placeholder="Vou fazer isso porque quero..."
            className="block bg-zinc-900/15 py-3 pl-2.5 ring-1 ring-zinc-800 text-zinc-300 outline-none focus-within:ring-zinc-300 rounded-md w-full mt-3"
          />
        </div>

        <HabitFrequency habitsWeekdays={habitsWeekdays} setHabitsWeekdays={setHabitsWeekdays} />
        <HabitBadge
          currentBadge={currentBadge}
          setCurrentBadge={setCurrentBadge}
          showAllEmojis={showAllEmojis}
          setShowAllEmojis={setShowAllEmojis}
        />
        <HabitColor
          currentColor={currentColor}
          setCurrentColor={setCurrentColor}
          setShowAllColors={setShowAllColors}
          showAllColors={showAllColors}
        />

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
