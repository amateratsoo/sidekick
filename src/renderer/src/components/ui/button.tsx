import { ComponentPropsWithRef, forwardRef } from 'react'
import { cn } from '@renderer/utils'

interface Props extends ComponentPropsWithRef<'button'> {}

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ children, className, ...props }, ref) => {
    return (
      <button
        className={cn(
          'rounded-lg bg-green-500 font-sans text-sm font-semibold text-zinc-950 px-2 py-1 cursor-pointer transition-transform active:scale-[93%]',
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
