import { atom } from 'jotai'

import type { SelectableHabit } from '@shared/types'

export interface HabitAtomProps extends SelectableHabit {
  completedOn: string[]
}

export const habitsAtom = atom<HabitAtomProps[]>([])
