import gachaConfig from '../config/gachaConfig.json'
import { getPool } from '../config/pools'

function getEventRewards(event) {
  if (event.poolId) {
    const pool = getPool(event.poolId)
    return pool?.rewards ?? null
  }
  return event.rewards ?? null
}

function pickWeightedReward(rewards) {
  if (!rewards || rewards.length === 0) return null

  const totalWeight = rewards.reduce(
    (sum, reward) => sum + (reward.weight ?? 1),
    0,
  )

  const target = Math.random() * totalWeight
  let running = 0

  for (const reward of rewards) {
    running += reward.weight ?? 1
    if (target <= running) return reward
  }

  return rewards[rewards.length - 1]
}

function applyTrialControl(event, rewards, isTrial) {
  if (!rewards || !isTrial) return rewards

  const trialConfig = event.trialConfig
  if (!trialConfig) return rewards

  if (trialConfig.fixedRewardId) {
    const fixed = rewards.find((r) => r.id === trialConfig.fixedRewardId)
    if (fixed) return [fixed]
  }

  if (trialConfig.allowedRarities && trialConfig.allowedRarities.length > 0) {
    const allowedSet = new Set(trialConfig.allowedRarities.map((v) => v.toUpperCase()))
    const filtered = rewards.filter((r) => allowedSet.has((r.rarity || '').toUpperCase()))
    if (filtered.length > 0) return filtered
  }

  return rewards
}

export function useGachaDraw(eventId) {
  const event = gachaConfig.events.find((e) => e.id === eventId)
  const rewards = event ? getEventRewards(event) : null
  const pool = event?.poolId ? getPool(event.poolId) : null

  const draw = ({ isTrial } = { isTrial: false }) => {
    if (!event || !rewards || rewards.length === 0) return null

    const candidateRewards = applyTrialControl(event, rewards, isTrial)
    const reward = pickWeightedReward(candidateRewards)

    return {
      reward,
      event,
      pool,
    }
  }

  const drawMultiple = ({ isTrial, count = 10 } = {}) => {
    if (!event || !rewards || rewards.length === 0) return null
    const list = []
    const candidateRewards = applyTrialControl(event, rewards, isTrial)
    for (let i = 0; i < count; i++) {
      const r = pickWeightedReward(candidateRewards)
      if (r) list.push(r)
    }
    return {
      rewards: list,
      event,
      pool,
    }
  }

  return {
    event,
    pool,
    rewards,
    draw,
    drawMultiple,
  }
}
