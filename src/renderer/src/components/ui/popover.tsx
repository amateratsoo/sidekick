import * as RadixPopover from '@radix-ui/react-popover'
import type { ReactNode } from 'react'
import type { PopoverContentProps } from '@radix-ui/react-popover'

import { cn } from '@renderer/utils'

interface Props extends PopoverContentProps {
  children: ReactNode
  trigger: ReactNode
}

export function Popover({ children, trigger, className, ...props }: Props) {
  return (
    <RadixPopover.Root>
      <RadixPopover.Trigger asChild>{trigger}</RadixPopover.Trigger>
      <RadixPopover.Anchor />
      <RadixPopover.Portal>
        <RadixPopover.Content className={cn('bg-zinc-950', className)} {...props}>
          {children}
        </RadixPopover.Content>
      </RadixPopover.Portal>
    </RadixPopover.Root>
  )
}
