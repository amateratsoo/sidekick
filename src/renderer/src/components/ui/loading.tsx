import { LoaderCircle } from 'lucide-react'

export function Loading() {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <LoaderCircle className="size-5 animate-spin text-zinc-700" />
    </div>
  )
}
