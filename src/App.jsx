import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainGachaPage from './pages/MainGachaPage'
import GachaDrawPage from './pages/GachaDrawPage'
import GachaResultPage from './pages/GachaResultPage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainGachaPage />} />
        <Route path="/gacha/:eventId" element={<GachaDrawPage />} />
        <Route path="/gacha/:eventId/result" element={<GachaResultPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
