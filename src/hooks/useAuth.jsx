import { createContext, useContext, useEffect, useState } from 'react'

const STORAGE_KEY = 'gacha-auth-v1'

const AuthContext = createContext(null)

const trialUser = {
  id: 'trial',
  name: '試用玩家',
  isTrial: true,
}

function loadAuth() {
  if (typeof window === 'undefined') return { user: null }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return { user: null }
    const parsed = JSON.parse(raw)
    return { user: parsed.user ?? null }
  } catch (e) {
    return { user: null }
  }
}

export function AuthProvider({ children }) {
  const [state, setState] = useState(() => loadAuth())

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch (e) {
      // ignore
    }
  }, [state])

  const loginAsTrial = () => {
    setState({ user: trialUser })
  }

  const logout = () => {
    setState({ user: null })
  }

  const value = {
    user: state.user,
    isLoggedIn: !!state.user,
    loginAsTrial,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
