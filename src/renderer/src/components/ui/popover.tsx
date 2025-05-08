import { SetStateAction } from 'react'
import * as RadixPopover from '@radix-ui/react-popover'
import type { ReactNode } from 'react'
import type { PopoverContentProps } from '@radix-ui/react-popover'

import { cn } from '@renderer/utils'

export interface Props extends PopoverContentProps {
  children: ReactNode
  trigger?: ReactNode
  onOpenChange?: (state: SetStateAction<boolean>) => void
  open?: boolean
  portalContainer?: Element | DocumentFragment | null | undefined
  anchored?: boolean
}

export function Popover({
  children,
  trigger = null,
  className,
  open,
  onOpenChange,
  portalContainer,
  anchored = false,
  ...props
}: Props) {
  return (
    <RadixPopover.Root onOpenChange={onOpenChange} open={open}>
      <RadixPopover.Trigger asChild>{trigger}</RadixPopover.Trigger>
      {anchored && <RadixPopover.Anchor />}
      <RadixPopover.Portal container={portalContainer}>
        <RadixPopover.Content
          className={cn(
            'select-none data-[state=open]:animate-fade-in [animation-duration:115ms] data-[state=closed]:animate-fade-out will-change-transform bg-zinc-950',
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
