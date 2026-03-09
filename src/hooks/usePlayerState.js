import { useEffect, useState } from 'react'

const STORAGE_KEY = 'gacha-player-state-v1'

const initialState = {
  isMember: false,
  ownedRewards: [], // { eventId, rewardId, name, rarity, obtainedAt }
}

function loadState() {
  if (typeof window === 'undefined') return initialState
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
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

export function usePlayerState() {
  const [state, setState] = useState(initialState)

  useEffect(() => {
    setState(loadState())
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch (e) {
      // ignore
    }
  }, [state])

  const markAsMember = () => {
    setState((prev) => ({ ...prev, isMember: true }))
  }

  const claimReward = ({ eventId, reward }) => {
    if (!reward) return
    setState((prev) => {
      const exists = prev.ownedRewards.some(
        (r) => r.eventId === eventId && r.rewardId === reward.id,
      )
      if (exists) return prev

      const entry = {
        eventId,
        rewardId: reward.id,
        name: reward.name,
        rarity: reward.rarity,
        obtainedAt: new Date().toISOString(),
      }

      return {
        ...prev,
        ownedRewards: [...prev.ownedRewards, entry],
      }
    })
  }

  return {
    ...state,
    markAsMember,
    claimReward,
  }
}
