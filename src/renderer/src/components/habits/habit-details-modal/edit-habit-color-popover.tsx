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
  id: string
}

export function EditHabitColorPopover({
  color,
  setColor,
  isColorEditMode,
  setIsColorEditMode,
  name,
  badge,
  id
}: Props) {
  return (
    <Popover
      open={isColorEditMode}
      onOpenChange={setIsColorEditMode}
      align="center"
      side="top"
      sideOffset={-4}
      anchored
      className="rounded-xl overflow-hidden border border-zinc-900 shadow-zinc-900/40 shadow-2xl scale-95"
    >
      <div className="bg-zinc-950 w-fit h-fit flex">
        <div className="p-4 flex items-center justify-center">
          <ColorPicker
            // side="bottom"
            // align="end"
            // sideOffset={74}
            // alignOffset={-142}
            side="left"
            align="start"
            sideOffset={32}
            alignOffset={-122}
            default_value={color}
            handleColorChange={setColor}
          >
            <button
              className="rounded-3xl text-2xl size-20 mr-2 ml-3.5 aspect-square cursor-pointer"
              style={{ backgroundColor: color }}
            />
          </ColorPicker>
        </div>

        <div className="bg-zinc-950 rounded-r-lg w-full p-1.5">
          <div className="-w-[16.7rem] w-64">
            <HabitCard name={name} badge={badge} id={id} color={color} />
          </div>
        </div>
      </div>
    </Popover>
  )
}
