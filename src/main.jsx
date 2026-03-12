import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './hooks/useAuth'
import { PlayerStateProvider } from './hooks/usePlayerState'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <PlayerStateProvider>
        <App />
      </PlayerStateProvider>
    </AuthProvider>
  </StrictMode>,
)
