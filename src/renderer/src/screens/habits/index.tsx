import { useEffect, useState, useRef } from 'react'
import { useAtom } from 'jotai'

import { habitsAtom } from '@renderer/store'
import { cn } from '@renderer/utils'
import { CreateHabitModal } from './components/create-habit-modal'
import { HabitDetailsModal } from './components/habit-details-modal'
import { HabitCard } from './components/habit-card'
import type { SelectableHabit } from '@shared/types'

const { db } = window.api

export function Habits(): JSX.Element {
  const [habits, setHabits] = useAtom<SelectableHabit[]>(habitsAtom)
  const [openModal, setOpenModal] = useState(false)
  const habitDetails = useRef<SelectableHabit>(undefined)

  useEffect(() => {
    ;(async (): Promise<void> => {
      const habits = await db.habit.findAll()
      setHabits(habits)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function openHabitDetailsModal(props: SelectableHabit): void {
    habitDetails.current = props

    setOpenModal(true)
  }

  return (
    <main className="w-full h-full">
      <div className={cn('w-full flex items-center justify-between py-4 px-6')}>
        <h1 className={cn('text-4xl font-bold font-serif italic text-zinc-300')}>Seus hábitos</h1>

        <CreateHabitModal />
      </div>

      <div
        className={cn(
          'px-6 pb-6 gap-2.5 grid-cols-1 grid @lg:grid-cols-2 @2xl:grid-cols-3 @5xl:grid-cols-4 @6xl:grid-cols-5'
        )}
      >
        {habits.map((props) => (
          <button
            onClick={() => openHabitDetailsModal(props)}
            key={props.id}
            className="cursor-pointer"
          >
            <HabitCard {...props} key={props.id} />
          </button>
        ))}
      </div>

      <HabitDetailsModal open={openModal} onOpenChange={setOpenModal} {...habitDetails.current!} />
    </main>
  )
}
