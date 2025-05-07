import { SetStateAction } from 'react'
import * as RadixPopover from '@radix-ui/react-popover'
import type { ReactNode } from 'react'
import type { PopoverContentProps } from '@radix-ui/react-popover'

import { cn } from '@renderer/utils'

interface Props extends PopoverContentProps {
  children: ReactNode
  trigger?: ReactNode
  onOpenChange?: (state: SetStateAction<boolean>) => void
  open?: boolean
}

export function Popover({
  children,
  trigger = null,
  className,
  open = undefined,
  onOpenChange = undefined,
  ...props
}: Props) {
  return (
    <RadixPopover.Root onOpenChange={onOpenChange} open={open}>
      <RadixPopover.Trigger asChild>{trigger}</RadixPopover.Trigger>
      <RadixPopover.Anchor />
      <RadixPopover.Portal>
        <RadixPopover.Content
          className={cn(
            'data-[state=open]:animate-fade-in [animation-duration:115ms] data-[state=closed]:animate-fade-out will-change-transform bg-zinc-950',
            className
          )}
          {...props}
        >
          {children}
        </RadixPopover.Content>
      </RadixPopover.Portal>
    </RadixPopover.Root>
  )
}
