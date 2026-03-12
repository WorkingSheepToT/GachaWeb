import { Link } from 'react-router-dom'
import './AccountOverlay.css'
import { useAuth } from '../hooks/useAuth'
import { usePlayerState } from '../hooks/usePlayerState'
import gachaConfig from '../config/gachaConfig.json'

function computeRank(ownedCount) {
  const xpPerDraw = 1000
  const xp = ownedCount * xpPerDraw
  const levelMax = 100000
  const progress = Math.min(1, xp / levelMax)

  let name = 'BEGINNER'
  if (xp >= 80000) name = 'MASTER'
  else if (xp >= 40000) name = 'ADVANCED'
  else if (xp >= 15000) name = 'STANDARD'

  return {
    name,
    xp,
    levelMax,
    progress,
  }
}

function AccountOverlay({ open, onClose }) {
  const { user, isLoggedIn } = useAuth()
  const { ownedRewards } = usePlayerState()

  if (!open) return null

  const rank = computeRank(ownedRewards.length)

  const eventsById = new Map(gachaConfig.events.map((e) => [e.id, e]))
  const latest = [...ownedRewards]
    .sort((a, b) => new Date(b.obtainedAt).getTime() - new Date(a.obtainedAt).getTime())
    .slice(0, 5)

  return (
    <div className="account-overlay">
      <div className="account-backdrop" onClick={onClose} />
      <div className="account-panel">
        <header className="account-header">
          <h2 className="account-title">my page</h2>
          <button type="button" className="account-close" onClick={onClose} aria-label="關閉">
            ×
          </button>
        </header>

        <section className="account-rank-card">
          <div className="rank-label">RANK</div>
          <div className="rank-name">{rank.name}</div>
          <div className="rank-xp">
            {rank.xp.toLocaleString()} / {rank.levelMax.toLocaleString()}
          </div>
          <div className="rank-bar">
            <div className="rank-bar-fill" style={{ width: `${rank.progress * 100}%` }} />
          </div>
          <div className="rank-user-line">
            {isLoggedIn ? (
              <span>{user?.name}</span>
            ) : (
              <span>尚未登入 · 使用訪客資料</span>
            )}
          </div>
        </section>

        <section className="account-shortcuts">
          <button type="button" className="shortcut-item" disabled>
            <span className="shortcut-icon">🔔</span>
            <span className="shortcut-label">通知</span>
          </button>
          <button type="button" className="shortcut-item" disabled>
            <span className="shortcut-icon">🎟️</span>
            <span className="shortcut-label">RUSH</span>
          </button>
          <Link to="/history" className="shortcut-item" onClick={onClose}>
            <span className="shortcut-icon">📒</span>
            <span className="shortcut-label">獲得記錄</span>
          </Link>
          <Link to="/inventory" className="shortcut-item" onClick={onClose}>
            <span className="shortcut-icon">📦</span>
            <span className="shortcut-label">物品庫</span>
          </Link>
          <button type="button" className="shortcut-item" disabled>
            <span className="shortcut-icon">🎫</span>
            <span className="shortcut-label">優惠券</span>
          </button>
        </section>

        <section className="account-history-preview">
          <h3 className="section-title">最近抽卡</h3>
          {latest.length === 0 ? (
            <p className="history-empty">尚未有抽卡紀錄。</p>
          ) : (
            <ul className="history-mini-list">
              {latest.map((entry, idx) => {
                const event = eventsById.get(entry.eventId)
                return (
                  <li key={`${entry.eventId}-${entry.rewardId}-${idx}`} className="history-mini-item">
                    <div className="history-mini-main">
                      <span className={`history-mini-rarity history-mini-rarity--${(entry.rarity || '').toLowerCase()}`}>
                        {entry.rarity}
                      </span>
                      <span className="history-mini-name">{entry.name}</span>
                    </div>
                    <div className="history-mini-meta">
                      <span className="history-mini-event">{event ? event.title : entry.eventId}</span>
                      {entry.isTrial && <span className="history-mini-tag">試用</span>}
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
          <Link to="/history" className="history-view-all" onClick={onClose}>
            查看全部紀錄 ›
          </Link>
        </section>

        <section className="account-settings">
          <button type="button" className="settings-row" disabled>
            <span>更改您的送貨地址</span>
            <span className="settings-arrow">›</span>
          </button>
          <button type="button" className="settings-row" disabled>
            <span>帳戶設定</span>
            <span className="settings-arrow">›</span>
          </button>
          <button type="button" className="settings-row" disabled>
            <span>諮詢</span>
            <span className="settings-arrow">›</span>
          </button>
          <button type="button" className="settings-row" disabled>
            <span>服務條款</span>
            <span className="settings-arrow">›</span>
          </button>
          <button type="button" className="settings-row" disabled>
            <span>隱私權政策</span>
            <span className="settings-arrow">›</span>
          </button>
        </section>
      </div>
    </div>
  )
}

export default AccountOverlay
