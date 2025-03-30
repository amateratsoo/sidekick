import type { ReactNode, ComponentProps } from 'react'
import { cn } from '@renderer/utils'

interface Props extends ComponentProps<'div'> {
  children: ReactNode
}

const root = document.querySelector(':root') as HTMLElement
let timeout: NodeJS.Timeout

export function ScrollArea({ children, className, ...props }: Props): JSX.Element {
  function showScrollbarOnMouseMove(event: React.MouseEvent): void {
    clearTimeout(timeout)

    root.style.setProperty('--scrollbar-color', 'rgba(24, 24, 27, 1)')

    timeout = setTimeout(() => {
      root.style.setProperty('--scrollbar-color', 'transparent')
    }, 1500)
  }

  return (
    <div
      className={cn('custom-scrollbar', className)}
      onMouseMove={showScrollbarOnMouseMove}
      {...props}
    >
      {children}
    </div>
  )
}
