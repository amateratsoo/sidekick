import * as Dialog from '@radix-ui/react-dialog'
import type { ClassValue } from 'clsx'

import { ScrollArea } from './scroll-area'
import { cn } from '@renderer/utils'

interface Props {
  children: React.ReactNode
  trigger: React.ReactNode
  title?: string
  description?: string
  open: boolean
  onOpenChange: (state: React.SetStateAction<boolean>) => void
  className?: ClassValue
  scrollAreaClassName?: ClassValue
}

export function Modal({
  trigger,
  title,
  description,
  children,
  open,
  onOpenChange,
  className,
  scrollAreaClassName
}: Props): JSX.Element {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        <Dialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-lg -p-[25px] border border-zinc-900 bg-zinc-950 focus:outline-none data-[state=open]:animate-contentShow',
            className
          )}
        >
          <ScrollArea className={cn('h-full w-full p-[25px] overflow-auto', scrollAreaClassName)}>
            <Dialog.Title className="text-zinc-300 font-semibold text-2xl">{title}</Dialog.Title>
            <Dialog.Description>{description}</Dialog.Description>
            <Dialog.Close />
            {children}
          </ScrollArea>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
