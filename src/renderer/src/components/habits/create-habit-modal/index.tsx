import { useState, useEffect } from 'react'
import { useSetAtom } from 'jotai'
import { habitsAtom } from '@renderer/store'

import type { SelectableHabit } from '@shared/types'

import { Modal, Input, Button } from '@renderer/components/ui'
import { HabitFrequency } from './habit-frequency'
import { HabitBadge } from './habit-badge'
import { HabitColor } from './habit-color'
import { HabitTrackingTime } from './habit-tracking-time'
import { Feather } from '@renderer/components/svg'

const { db } = window.api

const DEFAULT_BADGE = '💪'
const DEFAULT_COLOR = '#22c55e'

export function CreateHabitModal(): JSX.Element {
  const [habitsWeekdays, setHabitsWeekdays] = useState<string[]>([])
  const [currentBadge, setCurrentBadge] = useState<string>(DEFAULT_BADGE)
  const [currentColor, setCurrentColor] = useState<string>(DEFAULT_COLOR)
  const [_, setShowAllColors] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [showNameError, setShowNameError] = useState(false)
  const [showWeekdayError, setShowWeekdayError] = useState(false)

  const setHabits = useSetAtom(habitsAtom)

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

    const form = event.currentTarget as HTMLFormElement
    const formData = new FormData(form)
    const name = formData.get('habit-name')?.toString().trim() || ''
    const description = formData.get('description')?.toString().trim() || ''

    const isNameValid = !!name
    const isWeekdaysValid = habitsWeekdays.length > 0

    setShowNameError(!isNameValid)
    setShowWeekdayError(!isWeekdaysValid)

    if (!isNameValid || !isWeekdaysValid) return

    const data = {
      id: crypto.randomUUID(),
      name,
      description,
      streak: 0,
      frequency: JSON.stringify(habitsWeekdays),
      badge: currentBadge || DEFAULT_BADGE,
      color: currentColor || DEFAULT_COLOR
    }

    try {
      const habit = (await db.habit.create(data)) as SelectableHabit
      setHabits((prev) => [...prev, { ...habit, completedOn: [] }])
      setOpenModal(false)
    } catch (error) {
      console.error("Couldn't create the habit:", error)
    }
  }

  return (
    <Modal
      className="h-[43rem]"
      open={openModal}
      onOpenChange={setOpenModal}
      title="Criar novo hábito"
      icon={<Feather className="size-5 mr-1.5 transition-transform" />}
      trigger={
        <Button className="bg-green-500 flex items-center justify-center gap-1 group">
          <Feather className="transition-transform duration-300 group-hover:animate-feather-write" />
          novo hábito
        </Button>
      }
    >
      <form onSubmit={createHabit}>
        <div>
          <label htmlFor="" className="text-lg text-zinc-500/40">
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
          <label htmlFor="" className="text-lg text-zinc-500/40">
            Descrição
          </label>
          <Input
            name="description"
            id="description"
            type="text"
            placeholder="Vou fazer isso porque quero..."
          />
        </div>

        <HabitTrackingTime />
        <HabitFrequency
          setShowError={setShowWeekdayError}
          showError={showWeekdayError}
          habitsWeekdays={habitsWeekdays}
          setHabitsWeekdays={setHabitsWeekdays}
        />
        <HabitBadge
          currentBadge={currentBadge || DEFAULT_BADGE}
          setCurrentBadge={setCurrentBadge}
        />
        <HabitColor
          currentColor={currentColor || DEFAULT_COLOR}
          setCurrentColor={setCurrentColor}
        />

        <button
          className="border-b-4 border-2 border-emerald-700 w-full gap-1.5 flex items-center justify-center rounded-xl bg-green-500 py-2 text-lg font-bold mt-7 transition-transform active:scale-[96%]"
          type="submit"
        >
          Criar hábito
        </button>
      </form>
    </Modal>
  )
}
