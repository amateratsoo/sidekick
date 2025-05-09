import { Modal, type Props as ModalProps } from './modal'
import { Button } from './button'
import { cn } from '@renderer/utils'

export interface Action {
  name: string
  action: () => void
  className?: string
}

interface Props extends Omit<ModalProps, 'children'> {
  actions?: Action[]
}

export function AlertDialog({ actions = [], ...props }: Props) {
  return (
    <Modal {...props}>
      <div className="w-full flex justify-end gap-2.5">
        {actions.map((action) => {
          return (
            <Button
              key={action.name}
              className={cn(
                'rounded-lg bg-zinc-900 font-sans text-sm font-semibold text-zinc-400 px-2 py-1 transition-transform active:scale-[93%]',
                action.className || ''
              )}
              onClick={action.action}
            >
              {action.name}
            </Button>
          )
        })}
      </div>
    </Modal>
  )
}
