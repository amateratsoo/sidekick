import { atom } from 'jotai'
import type { SelectableTask } from '@shared/types'

export const currentTasksAtom = atom<SelectableTask[]>([])
