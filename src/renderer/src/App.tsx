import { Router } from './components/router'
import { ScrollArea } from './components/scroll-area'
import { WindowBorder } from './components/window-border'

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
