import type { ElementType } from 'react'
import { Popover, Props as PopoverProps } from './popover'
import { cn } from '@renderer/utils'

export interface Action {
  name: string
  icon?: ElementType
  action: () => void
  className?: string
  containerClassName?: string
}

interface Props extends Omit<PopoverProps, 'children'> {
  actions: Action[]
  triggerClassName?: string
}

export function ActionMenu({
  actions,
  trigger: Trigger,
  className,
  triggerClassName,
  ...props
}: Props) {
  return (
    <Popover
      align="center"
      side="top"
      sideOffset={10}
      trigger={
        <button
          className={cn(
            'rounded-md h-fit w-fit p-1 bg-zinc-900/60 border border-zinc-800 ml-2.5',
            triggerClassName
          )}
        >
          {Trigger}
        </button>
      }
      className={cn(
        'bg-zinc-950 rounded-lg border border-zinc-900 shadow-zinc-900/40 shadow-2xl',
        className
      )}
      {...props}
    >
      <ul className="flex flex-col gap-1.5 rounded-lg p-1.5 w-40 bg-zinc-900/20">
        {actions.map((action) => {
          const Icon = action.icon

          return (
            <li
              className={cn(
                '--hover:bg-zinc-800/30 hover:bg-zinc-900/60 rounded-md text-zinc-300',
                action.className
              )}
              key={action.name}
            >
              <button onClick={action.action} className="flex gap-2.5 w-full h-full p-1 px-1.5">
                {Icon ? (
                  <div
                    className={cn(
                      'rounded-md grid place-items-center h-fit w-fit p-1 bg-zinc-900/60 border border-zinc-800',
                      action.containerClassName
                    )}
                  >
                    <Icon className="size-3.5" />
                  </div>
                ) : (
                  <div />
                )}

                <span>{action.name}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </Popover>
  )
}
