import './HistoryPage.css'
import gachaConfig from '../config/gachaConfig.json'
import { usePlayerState } from '../hooks/usePlayerState'

function HistoryPage() {
  const { ownedRewards } = usePlayerState()

  const eventsById = new Map(gachaConfig.events.map((e) => [e.id, e]))

  const sorted = [...ownedRewards].sort(
    (a, b) => new Date(b.obtainedAt).getTime() - new Date(a.obtainedAt).getTime(),
  )

  return (
    <div className="history-page">
      <div className="history-inner">
        <h1 className="history-title">抽卡紀錄</h1>
        {sorted.length === 0 ? (
          <p className="history-empty">目前沒有任何抽卡紀錄。</p>
        ) : (
          <ul className="history-list">
            {sorted.map((entry, idx) => {
              const event = eventsById.get(entry.eventId)
              return (
                <li key={`${entry.eventId}-${entry.rewardId}-${idx}`} className="history-item">
                  <div className="history-main">
                    <span className={`history-rarity history-rarity--${(entry.rarity || '').toLowerCase()}`}>
                      {entry.rarity}
                    </span>
                    <span className="history-name">{entry.name}</span>
                  </div>
                  <div className="history-meta">
                    <span className="history-event">{event ? event.title : entry.eventId}</span>
                    <span className="history-time">
                      {new Date(entry.obtainedAt).toLocaleString()}
                    </span>
                    {entry.isTrial && <span className="history-tag">試用</span>}
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

export default HistoryPage
