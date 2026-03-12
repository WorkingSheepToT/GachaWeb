import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './useAuth'

const STORAGE_KEY_BASE = 'gacha-player-state-v1'

const PlayerStateContext = createContext(null)

const initialState = {
  ownedRewards: [], // { eventId, rewardId, name, rarity, obtainedAt, isTrial }
}

function loadState(storageKey) {
  if (typeof window === 'undefined') return initialState
  try {
    const raw = window.localStorage.getItem(storageKey)
    if (!raw) return initialState
    const parsed = JSON.parse(raw)
    return {
      ...initialState,
      ...parsed,
      ownedRewards: Array.isArray(parsed.ownedRewards) ? parsed.ownedRewards : [],
    }
  } catch (e) {
    return initialState
  }
}

export function PlayerStateProvider({ children }) {
  const { user } = useAuth()
  const storageKey = `${STORAGE_KEY_BASE}-${user?.id || 'guest'}`

  const [state, setState] = useState(() => loadState(storageKey))

  useEffect(() => {
    setState(loadState(storageKey))
  }, [storageKey])

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(state))
    } catch (e) {
      // ignore
    }
  }, [state, storageKey])

  const claimReward = ({ eventId, reward, isTrial }) => {
    if (!reward) return
    setState((prev) => {
      const entry = {
        eventId,
        rewardId: reward.id,
        name: reward.name,
        rarity: reward.rarity,
        obtainedAt: new Date().toISOString(),
        isTrial: !!isTrial,
      }

      return {
        ...prev,
        ownedRewards: [...prev.ownedRewards, entry],
      }
    })
  }

  const value = {
    ...state,
    claimReward,
  }

  return (
    <PlayerStateContext.Provider value={value}>
      {children}
    </PlayerStateContext.Provider>
  )
}

export function usePlayerState() {
  const ctx = useContext(PlayerStateContext)
  if (!ctx) {
    throw new Error('usePlayerState must be used within PlayerStateProvider')
  }
  return ctx
}
