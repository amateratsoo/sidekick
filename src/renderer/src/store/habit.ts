import { atom } from 'jotai'

import type { SelectableHabit } from '@shared/types'

export const habitsAtom = atom<SelectableHabit[]>([])
