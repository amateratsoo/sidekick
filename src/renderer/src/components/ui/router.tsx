import { BrowserRouter, Route, Routes } from 'react-router'
import { Habits } from '@renderer/screens/habits'

export function Router(): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Habits />} />
      </Routes>
    </BrowserRouter>
  )
}
