import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Deals from './pages/Deals'
import Tracker from './pages/Tracker'
import CheapDates from './pages/CheapDates'
import Airports from './pages/Airports'
import Stopovers from './pages/Stopovers'
import Guide from './pages/Guide'
import Techniques from './pages/Techniques'
import Pro from './pages/Pro'
import Agents from './pages/Agents'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/deals" replace />} />
        <Route path="/deals" element={<Deals />} />
        <Route path="/tracker" element={<Tracker />} />
        <Route path="/dates" element={<CheapDates />} />
        <Route path="/airports" element={<Airports />} />
        <Route path="/stopovers" element={<Stopovers />} />
        <Route path="/guide" element={<Guide />} />
        <Route path="/techniques" element={<Techniques />} />
        <Route path="/pro" element={<Pro />} />
        <Route path="/agents" element={<Agents />} />
        <Route path="*" element={<Navigate to="/deals" replace />} />
      </Route>
    </Routes>
  )
}
