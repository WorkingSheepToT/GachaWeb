import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainGachaPage from './pages/MainGachaPage'
import GachaDrawPage from './pages/GachaDrawPage'
import GachaResultPage from './pages/GachaResultPage'
import LoginPage from './pages/LoginPage'
import HistoryPage from './pages/HistoryPage'
import InventoryPage from './pages/InventoryPage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainGachaPage />} />
        <Route path="/gacha/:eventId" element={<GachaDrawPage />} />
        <Route path="/gacha/:eventId/result" element={<GachaResultPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
