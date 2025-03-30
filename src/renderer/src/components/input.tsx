import { type ComponentProps } from 'react'
import { InfoCircledIcon } from '@radix-ui/react-icons'

import { cn } from '@renderer/utils'

interface Props extends ComponentProps<'input'> {
  showError?: boolean
  setShowError?: (state: boolean) => void
  errorMessage?: string
}

export function Input({
  showError = false,
  setShowError = () => {},
  errorMessage,
  ...props
}: Props) {
  return (
    <>
      <input
        onChange={(event) => {
          if (event.target.value.trim().length > 0) {
            setShowError(false)
          }
        }}
        className={cn(
          'bg-zinc-900/15 py-2.5 pl-2.5 ring-1 ring-zinc-800 text-zinc-300 outline-none focus-within:ring-zinc-300 rounded-md w-full mt-3',
          {
            'ring-red-500': showError
          }
        )}
        {...props}
      />
      {showError && (
        <span className="flex gap-1 text-red-500 text-sm items-center mt-2">
          {' '}
          <InfoCircledIcon /> {errorMessage}
        </span>
      )}
    </>
  )
}
