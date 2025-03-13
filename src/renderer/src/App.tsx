import { Router } from './components/router'
import { ScrollArea } from './components/scroll-area'

function App(): JSX.Element {
  return (
    <div className="w-screen h-screen">
      <ScrollArea className="h-screen w-screen overflow-x-hidden overflow-y-auto">
        <Router />
      </ScrollArea>
    </div>
  )
}

export default App
