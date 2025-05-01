import type { SetStateAction } from 'react'
import { EmojiPicker, Input, Popover } from '@renderer/components/ui'

interface Props {
  isEditMode: boolean
  setIsEditMode: (state: SetStateAction<boolean>) => void
  badge: string
  setBadge: (state: SetStateAction<string>) => void
  name: string
  setName: (state: SetStateAction<string>) => void
  description: string
  setDescription: (state: SetStateAction<string | undefined>) => void
}

export function EditHabitPopover({
  isEditMode,
  setIsEditMode,
  badge,
  setBadge,
  description,
  setDescription,
  name,
  setName
}: Props) {
  return (
    <Popover
      open={isEditMode}
      onOpenChange={setIsEditMode}
      align="start"
      side="bottom"
      sideOffset={10}
    >
      <div className="rounded-lg bg-zinc-950 border border-zinc-900 shadow-zinc-900/40 shadow-2xl w-80 h-fit flex">
        <div className="p-4 flex items-center justify-center">
          <EmojiPicker onEmojiSelect={setBadge} className="mt-11">
            <button className="rounded-lg p-2 bg-zinc-900/60 text-2xl aspect-square cursor-pointer">
              {badge}
            </button>
          </EmojiPicker>
        </div>
        <div className="bg-zinc-900/50 rounded-r-lg w-full">
          <Input
            className="w-full rounded-none rounded-tr-lg m-0 outline-none focus:ring-2 focus:ring-zinc-700 focus:border-0 bg-transparent pr-2 placeholder:text-zinc-600 ring-0"
            value={name}
            onChange={({ target }) => setName(target.value)}
            placeholder="Pense em um nome criativo"
          />

          <div className="bg-zinc-900 h-px" role="hr" />

          <Input
            className="w-full rounded-none rounded-br-lg m-0 outline-none focus:ring-2 focus:ring-zinc-700 bg-transparent pr-2 placeholder:text-zinc-600 text-zinc-300 ring-0"
            onChange={({ target }) => setDescription(target.value)}
            placeholder="Vou fazer isso porque quero..."
            value={description || ''}
          />
        </div>
      </div>
    </Popover>
  )
}
