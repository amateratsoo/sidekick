import { useState, useEffect } from 'react'
// @ts-ignore
import colors from 'tailwindcss/colors'
import { useSetAtom } from 'jotai'
import { habitsAtom } from '@renderer/store'

import type { SelectableHabit } from '@shared/types'

import { Modal, Input, Button } from '@renderer/components/ui'
import { HabitFrequency } from './habit-frequency'
import { HabitBadge } from './habit-badge'
import { HabitColor } from './habit-color'
import { HabitTrackingTime } from './habit-tracking-time'

const { db } = window.api

export function CreateHabitModal(): JSX.Element {
  const [habitsWeekdays, setHabitsWeekdays] = useState<string[]>([])
  const [currentBadge, setCurrentBadge] = useState<string>('')
  const [currentColor, setCurrentColor] = useState<string>('')
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
      icon={
        <svg
          width="36px"
          height="36px"
          viewBox="0 0 60 76"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          className="size-5 mr-1.5 transition-transform"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M40.9144 42.5043C41.2343 41.6144 40.9743 41.3345 40.0645 41.6244V41.6144C36.8749 42.6343 31.3456 44.0341 24.9865 42.7843C23.6567 42.5143 23.7367 41.4945 25.0865 41.4245C30.1258 41.1745 38.0047 40.0347 42.2542 35.6652C45.3503 32.4812 47.0048 27.6113 48.8466 22.1899C50.9841 15.8984 53.3739 8.86405 58.562 2.85962C58.6862 2.71513 58.8336 2.56132 58.9853 2.40288C60.031 1.3114 61.2873 0 56.6423 0C33.1845 0 24.678 18.9364 10.3822 50.7606C7.85393 56.3887 5.14463 62.42 2.13953 68.8208C1.88318 69.3646 1.62616 69.8836 1.38357 70.3734C0.689452 71.7749 0.113548 72.9377 0.00981892 73.7602C-0.0701704 74.4401 0.339775 75 1.14967 75C3.95021 74.9725 6.77916 70.0202 9.40189 65.4289C10.5902 63.3486 11.7363 61.3424 12.8181 59.902C14.2079 58.0522 15.5677 57.1924 17.2875 56.7424C18.6405 56.3819 20.1448 56.2122 21.7419 56.0319C23.5556 55.8272 25.4889 55.609 27.4562 55.0826C35.2251 53.0029 39.2446 47.2237 40.9144 42.5043ZM55.7925 67.9509C55.7925 71.8304 52.6429 74.98 48.7635 74.98C44.884 74.98 41.7344 71.8304 41.7344 67.9509C41.7344 64.0714 44.884 60.9219 48.7635 60.9219C52.6429 60.9219 55.7925 64.0714 55.7925 67.9509Z"
          ></path>
        </svg>
      }
      trigger={
        <Button className="bg-green-500 flex items-center justify-center gap-1 group">
          <svg
            width="36px"
            height="36px"
            viewBox="0 0 60 76"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            className="size-3.5 transition-transform duration-300 group-hover:animate-feather-write"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M40.9144 42.5043C41.2343 41.6144 40.9743 41.3345 40.0645 41.6244V41.6144C36.8749 42.6343 31.3456 44.0341 24.9865 42.7843C23.6567 42.5143 23.7367 41.4945 25.0865 41.4245C30.1258 41.1745 38.0047 40.0347 42.2542 35.6652C45.3503 32.4812 47.0048 27.6113 48.8466 22.1899C50.9841 15.8984 53.3739 8.86405 58.562 2.85962C58.6862 2.71513 58.8336 2.56132 58.9853 2.40288C60.031 1.3114 61.2873 0 56.6423 0C33.1845 0 24.678 18.9364 10.3822 50.7606C7.85393 56.3887 5.14463 62.42 2.13953 68.8208C1.88318 69.3646 1.62616 69.8836 1.38357 70.3734C0.689452 71.7749 0.113548 72.9377 0.00981892 73.7602C-0.0701704 74.4401 0.339775 75 1.14967 75C3.95021 74.9725 6.77916 70.0202 9.40189 65.4289C10.5902 63.3486 11.7363 61.3424 12.8181 59.902C14.2079 58.0522 15.5677 57.1924 17.2875 56.7424C18.6405 56.3819 20.1448 56.2122 21.7419 56.0319C23.5556 55.8272 25.4889 55.609 27.4562 55.0826C35.2251 53.0029 39.2446 47.2237 40.9144 42.5043ZM55.7925 67.9509C55.7925 71.8304 52.6429 74.98 48.7635 74.98C44.884 74.98 41.7344 71.8304 41.7344 67.9509C41.7344 64.0714 44.884 60.9219 48.7635 60.9219C52.6429 60.9219 55.7925 64.0714 55.7925 67.9509Z"
            ></path>
          </svg>
          novo hábito
        </Button>
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

        <HabitTrackingTime />
        <HabitFrequency
          setShowError={setShowWeekdayError}
          showError={showWeekdayError}
          habitsWeekdays={habitsWeekdays}
          setHabitsWeekdays={setHabitsWeekdays}
        />
        <HabitBadge currentBadge={currentBadge} setCurrentBadge={setCurrentBadge} />
        <HabitColor currentColor={currentColor} setCurrentColor={setCurrentColor} />

        <button
          className="border-b-4 border-2 border-emerald-700 w-full gap-1.5 flex items-center justify-center rounded-xl bg-green-500 py-2 text-lg font-bold mt-7 cursor-pointer transition-transform active:scale-[96%]"
          type="submit"
        >
          Criar hábito
        </button>
      </form>
    </Modal>
  )
}
