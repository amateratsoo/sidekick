import type { ReactNode, SetStateAction } from 'react'
import { EmojiPicker as Picker } from '@ferrucc-io/emoji-picker'
import { Popover } from './popover'
import type { PopoverContentProps } from '@radix-ui/react-popover'

import { cn } from '@renderer/utils'

interface Props extends PopoverContentProps {
  onEmojiSelect: (state: SetStateAction<string | undefined>) => void
  children: ReactNode
}

export function EmojiPicker({ onEmojiSelect, children, className, ...props }: Props) {
  return (
    <Popover
      trigger={children}
      align="center"
      side="bottom"
      sideOffset={8}
      className={cn('bg-zinc-950', className)}
    >
      <Picker
        className="border border-zinc-900 bg-zinc-900/20 rounded-xl w-64 shadow-zinc-900/40 shadow-2xl --shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)]"
        emojisPerRow={6}
        emojiSize={32}
        onEmojiSelect={onEmojiSelect}
        {...props}
      >
        <Picker.Header className="p-2 pb-1">
          <Picker.Input
            type="text"
            placeholder="filtrar emojis"
            autoFocus={true}
            className="py-1.5 pl-2.5 ring-1 ring-zinc-800 text-zinc-300 outline-none focus-within:ring-zinc-300 rounded-md w-full"
          />
        </Picker.Header>

        <Picker.Group className="pl-2 overflow-hidden picker-group --h-64">
          <Picker.List hideStickyHeader={false} />
        </Picker.Group>
      </Picker>
    </Popover>
  )
}
