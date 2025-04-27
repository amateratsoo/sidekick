import { Router, WindowBorder, ScrollArea } from './components/ui'

function App(): JSX.Element {
  return (
    <WindowBorder>
      <ScrollArea className="h-full w-full overflow-x-hidden overflow-y-auto">
        <Router />
      </ScrollArea>
    </WindowBorder>
  )
}

export default App
