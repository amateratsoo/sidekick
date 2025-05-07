import type { SetStateAction } from 'react'
import { ColorPicker, Popover } from '@renderer/components/ui'
import { HabitCard } from '../habit-card'

interface Props {
  isColorEditMode: boolean
  setIsColorEditMode: (state: SetStateAction<boolean>) => void
  color: string
  setColor: (state: SetStateAction<string>) => void
  name: string
  badge: string
}

export function EditHabitColorPopover({
  color,
  setColor,
  isColorEditMode,
  setIsColorEditMode,
  name,
  badge
}: Props) {
  return (
    <Popover
      open={isColorEditMode}
      onOpenChange={setIsColorEditMode}
      align="center"
      side="top"
      sideOffset={10}
      anchored
    >
      <div className="rounded-lg bg-zinc-950 border border-zinc-900 shadow-zinc-900/40 shadow-2xl w-80 h-fit flex">
        <div className="p-4 flex items-center justify-center">
          <ColorPicker side="bottom" align="end" default_value={color} handleColorChange={setColor}>
            <button
              className="rounded-lg bg-zinc-900/60 text-2xl size-12 aspect-square cursor-pointer"
              style={{ backgroundColor: color }}
            />
          </ColorPicker>
        </div>

        <div className="bg-zinc-950 rounded-r-lg w-full">
          <HabitCard name={name} badge={badge} />
        </div>
      </div>
    </Popover>
  )
}
