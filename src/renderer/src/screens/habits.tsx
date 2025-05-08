import { useEffect, useState } from 'react'
import { useAtom } from 'jotai'

import { habitsAtom, type HabitAtomProps } from '@renderer/store'
import { cn } from '@renderer/utils'
import { CreateHabitModal, HabitCard, HabitDetailsModal } from '../components/habits'

const { db } = window.api

export function Habits(): JSX.Element {
  const [habits, setHabits] = useAtom<HabitAtomProps[]>(habitsAtom)
  const [openModal, setOpenModal] = useState(false)
  const [selectedHabit, setSelectedHabit] = useState<HabitAtomProps | null>(null)

  useEffect(() => {
    const fetchHabits = async (): Promise<void> => {
      try {
        const habitData = await db.habit.findAllWithCompletedOn()
        setHabits(habitData)
      } catch (error) {
        console.error('Failed to fetch habits:', error)
      }
    }

    fetchHabits()
  }, [setHabits])

  const openHabitDetailsModal = (habit: HabitAtomProps): void => {
    setSelectedHabit(habit)
    setOpenModal(true)
  }

  return (
    <main className="w-full h-full">
      <div className={cn('w-full flex items-center justify-between py-4 px-6')}>
        <h1 className={cn('text-4xl font-bold font-serif italic text-zinc-300 select-none')}>
          Seus hábitos
        </h1>
        <CreateHabitModal />
      </div>

      <div
        className={cn(
          'px-6 pb-6 gap-2.5 grid-cols-1 grid @lg:grid-cols-2 @2xl:grid-cols-3 @5xl:grid-cols-4 @6xl:grid-cols-5'
        )}
      >
        {habits.map((habit) => (
          <button
            onClick={() => openHabitDetailsModal(habit)}
            key={habit.id}
            className="cursor-pointer"
          >
            <HabitCard {...habit} />
          </button>
        ))}
      </div>

      {selectedHabit && (
        <HabitDetailsModal
          open={openModal}
          onOpenChange={setOpenModal}
          {...selectedHabit}
          key={selectedHabit.id}
        />
      )}
    </main>
  )
}
