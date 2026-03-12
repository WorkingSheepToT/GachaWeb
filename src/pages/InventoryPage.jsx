import './InventoryPage.css'
import gachaConfig from '../config/gachaConfig.json'
import { getPool, getPoolImageUrl } from '../config/pools'
import { usePlayerState } from '../hooks/usePlayerState'

function aggregateInventory(ownedRewards) {
  const map = new Map() // key: `${eventId}|${rewardId}` -> { eventId, rewardId, name, rarity, count }
  for (const entry of ownedRewards) {
    const key = `${entry.eventId}|${entry.rewardId}`
    const existing = map.get(key)
    if (existing) {
      existing.count += 1
    } else {
      map.set(key, {
        eventId: entry.eventId,
        rewardId: entry.rewardId,
        name: entry.name,
        rarity: entry.rarity,
        count: 1,
      })
    }
  }
  return Array.from(map.values())
}

function InventoryPage() {
  const { ownedRewards } = usePlayerState()
  const eventsById = new Map(gachaConfig.events.map((e) => [e.id, e]))
  const items = aggregateInventory(ownedRewards)

  const getImageUrl = (eventId, rewardId) => {
    const event = eventsById.get(eventId)
    if (!event?.poolId) return ''
    const pool = getPool(event.poolId)
    if (!pool?.rewards) return ''
    const reward = pool.rewards.find((r) => r.id === rewardId)
    return reward?.image ? getPoolImageUrl(pool, reward.image) : ''
  }

  return (
    <div className="inventory-page">
      <div className="inventory-inner">
        <h1 className="inventory-title">我的物品庫</h1>
        <p className="inventory-desc">所有扭蛋獲得的物品，重複項目以數量顯示。</p>
        {items.length === 0 ? (
          <p className="inventory-empty">目前沒有任何物品。</p>
        ) : (
          <ul className="inventory-grid">
            {items.map((item) => {
              const imgUrl = getImageUrl(item.eventId, item.rewardId)
              return (
                <li key={`${item.eventId}-${item.rewardId}`} className="inventory-card">
                  <div className="inventory-card-image-wrap">
                    {imgUrl ? (
                      <img className="inventory-card-image" src={imgUrl} alt="" />
                    ) : (
                      <div className="inventory-card-image-placeholder" />
                    )}
                    {item.count > 1 && (
                      <span className="inventory-card-count">×{item.count}</span>
                    )}
                  </div>
                  <div className="inventory-card-body">
                    <span className={`inventory-card-rarity inventory-card-rarity--${(item.rarity || '').toLowerCase()}`}>
                      {item.rarity}
                    </span>
                    <span className="inventory-card-name">{item.name}</span>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

export default InventoryPage
