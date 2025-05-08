import { HashRouter, Route, Routes } from 'react-router'
import { Habits } from '@renderer/screens/habits'

export function Router(): JSX.Element {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Habits />} />
      </Routes>
    </HashRouter>
  )
}
