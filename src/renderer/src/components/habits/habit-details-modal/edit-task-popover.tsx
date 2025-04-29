import { Input, Popover } from '@renderer/components/ui'

interface Props {
  isEditMode: boolean
  setIsEditMode: (state: boolean) => void
  name: string
  setName: (state: string) => void
  description: string
  setDescription: (state: string) => void
}

export function EditTaskPopover({
  isEditMode,
  setIsEditMode,
  description,
  setDescription,
  name,
  setName
}: Props) {
  return (
    <Popover align="end" side="top" sideOffset={32} onOpenChange={setIsEditMode} open={isEditMode}>
      <div className="rounded-lg bg-zinc-950 border border-zinc-900 shadow-zinc-900/40 shadow-2xl w-72 h-fit">
        <div className="bg-zinc-900/50 rounded-lg">
          <Input
            className="w-full rounded-b-none rounded-t-lg m-0 outline-none focus:ring-2 focus:ring-zinc-700 bg-transparent pr-2 placeholder:text-zinc-600"
            value={name}
            onChange={({ target }) => setName(target.value)}
            placeholder="Pense em um nome criativo"
          />

          <textarea
            className="w-full min-h-24 max-h-72 text-zinc-300 p-2 outline-none ring-0 ring-zinc-700 focus:ring-2 custom-scrollbar overflow-x-hidden placeholder:text-center placeholder:text-sm placeholder:font-sans placeholder:text-zinc-600 field-sizing-content bg-transparent resize-none"
            onChange={({ target }) => setDescription(target.value)}
            placeholder="Use markdown ou texto simples para descrever a tarefa ✎𓂃"
            value={description || ''}
          />
        </div>
      </div>
    </Popover>
  )
}
