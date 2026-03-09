import { Link } from 'react-router-dom'
import './MainGachaPage.css'
import gachaConfig from '../config/gachaConfig.json'
import { getPool, getPoolImageUrl } from '../config/pools'

const { categories: CATEGORIES, events: GACHA_EVENTS } = gachaConfig

function MainGachaPage() {
  return (
    <div className="main-gacha">
      {/* Header */}
      <header className="gacha-header">
        <div className="header-inner">
          <div className="brand">
            <span className="brand-icon">🍀</span>
            <span className="brand-name">clove</span>
          </div>
          <div className="header-actions">
            <button type="button" className="icon-btn" aria-label="語言">文</button>
            <button type="button" className="icon-btn" aria-label="搜尋">🔍</button>
            <button type="button" className="btn-login">會員註冊/登錄</button>
          </div>
        </div>
        <div className="promo-banner">
          新用戶註冊送500pt & 最高90%折扣優惠券!
        </div>
      </header>

      {/* Category Navigation */}
      <nav className="category-nav">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            to="/"
            className={`nav-link ${cat.id === 'home' ? 'active' : ''}`}
          >
            {cat.label}
          </Link>
        ))}
      </nav>

      {/* Main Content - Gacha Event Cards */}
      <main className="gacha-content">
        {GACHA_EVENTS.map((event) => {
          const pool = event.poolId ? getPool(event.poolId) : null
          const posterUrl = pool?.poster ? getPoolImageUrl(pool, pool.poster) : ''
          return (
          <section key={event.id} className={`gacha-event-card gacha-event--${event.theme}`}>
            <h1 className="event-title">{event.title}</h1>
            <div className="event-tags">
              {event.tags.map((tag) => (
                <span key={tag} className="event-tag">{tag}</span>
              ))}
            </div>

            <div className="event-visual">
              <span className="visual-badge visual-badge--blue">{event.badge}</span>
              <span className="visual-guarantee">{event.guarantee}</span>
              {posterUrl ? (
                <img className="visual-poster" src={posterUrl} alt="" />
              ) : (
                <div className="visual-cards" aria-hidden />
              )}
              <span className="visual-highlight">{event.highlightText}</span>
              <span className="visual-sub">{event.subText}</span>
              <span className="visual-limit">{event.limitLabel}</span>
            </div>

            <div className="event-controls">
              <div className="control-cost">
                <span className="cost-icon">🪙</span>
                <span className="cost-value">{event.cost}</span>
              </div>
              <div className="control-progress">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${(event.remaining / event.total) * 100}%` }}
                  />
                </div>
                <span className="progress-text">剩餘 {event.remaining.toLocaleString()} / {event.total.toLocaleString()}</span>
              </div>
              <div className="control-buttons">
                <Link
                  to={`/gacha/${event.id}`}
                  className="btn-draw"
                >
                  抽一次
                </Link>
                <Link
                  to={`/gacha/${event.id}?draws=10`}
                  className="btn-draw btn-draw-10"
                >
                  抽十次
                  <span className="cost-10">{(event.cost10 ?? event.cost * 10).toLocaleString()}pt</span>
                </Link>
                <Link
                  to={`/gacha/${event.id}?trial=1`}
                  className="btn-draw btn-trial"
                >
                  <span className="trial-badge">免費</span>
                  試用抽獎
                </Link>
              </div>
            </div>
          </section>
          )
        })}
      </main>
    </div>
  )
}

export default MainGachaPage
