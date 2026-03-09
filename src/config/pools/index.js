/**
 * One gacha pool = one JSON. Each pool has: poolId, folder, poster, rewards.
 * Folder lives under public/ (e.g. public/Pokemon_Gatch1).
 */

import pokemonGatch1 from './pokemon_gatch1.json'

const poolMap = {
  pokemon_gatch1: pokemonGatch1,
}

export function getPool(poolId) {
  return poolMap[poolId] ?? null
}

export function getPoolImageUrl(pool, filename) {
  if (!pool || !pool.folder || !filename) return ''
  return `/${pool.folder}/${encodeURIComponent(filename)}`
}

export { poolMap }
