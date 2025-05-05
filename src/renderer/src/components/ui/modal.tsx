import type { SetStateAction } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import type { ClassValue } from 'clsx'

import { ScrollArea } from './scroll-area'
import { cn } from '@renderer/utils'

export interface Props {
  children: React.ReactNode
  trigger?: React.ReactNode
  title?: string
  description?: string
  open: boolean
  onOpenChange: (state: SetStateAction<boolean>) => void
  className?: ClassValue
  scrollAreaClassName?: ClassValue
  titleClassName?: ClassValue
  descriptionClassName?: ClassValue
  overlayClassName?: ClassValue
  overlay?: boolean
}

export function Modal({
  trigger = null,
  title,
  description,
  children,
  open,
  onOpenChange,
  className,
  scrollAreaClassName,
  titleClassName,
  descriptionClassName,
  overlayClassName,
  overlay = true
}: Props): JSX.Element {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        {overlay && (
          <Dialog.Overlay
            className={cn('fixed inset-0 bg-black/60 backdrop-blur-sm', overlayClassName)}
          />
        )}
        <Dialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-xl -p-[25px] border border-zinc-900 bg-zinc-950 focus:outline-none data-[state=open]:animate-contentShow',
            className
          )}
        >
          <ScrollArea className={cn('h-full w-full p-[25px] overflow-auto', scrollAreaClassName)}>
            <Dialog.Title className={cn('text-zinc-300 font-semibold text-2xl', titleClassName)}>
              {title}
            </Dialog.Title>
            <Dialog.Description className={cn('text-zinc-300', descriptionClassName)}>
              {description}
            </Dialog.Description>
            <Dialog.Close />
            {children}
          </ScrollArea>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
