import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import './MainGachaPage.css'
import gachaConfig from '../config/gachaConfig.json'
import { getPool, getPoolImageUrl } from '../config/pools'
import { useAuth } from '../hooks/useAuth'
import AccountOverlay from '../components/AccountOverlay'
import FilterModal from '../components/FilterModal'

const {
  categories: CATEGORIES,
  events: GACHA_EVENTS,
  filterTagCategories: FILTER_TAG_CATEGORIES = [],
  sortOptions: SORT_OPTIONS = []
} = gachaConfig

function MainGachaPage() {
  const { user, isLoggedIn, logout } = useAuth()
  const [showAccount, setShowAccount] = useState(false)
  const [activeCategoryId, setActiveCategoryId] = useState('home')
  const [filterModalOpen, setFilterModalOpen] = useState(false)
  const [selectedFilterTags, setSelectedFilterTags] = useState([])
  const [sortBy, setSortBy] = useState(SORT_OPTIONS[0]?.id ?? 'recommended')
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false)

  const filteredAndSortedEvents = useMemo(() => {
    let list = [...GACHA_EVENTS]

    // 1) 依上方分類列過濾（首頁 = 全部）
    if (activeCategoryId !== 'home') {
      list = list.filter((event) => event.theme === activeCategoryId)
    }

    // 2) 依標籤篩選（至少包含一個已選標籤）
    if (selectedFilterTags.length > 0) {
      list = list.filter((event) =>
        event.tags?.some((tag) => selectedFilterTags.includes(tag))
      )
    }

    // 3) 排序
    switch (sortBy) {
      case 'remaining':
        list = [...list].sort((a, b) => (a.remaining / (a.total || 1)) - (b.remaining / (b.total || 1)))
        break
      case 'new':
        list = [...list].reverse()
        break
      case 'popular':
        list = [...list].sort((a, b) => (b.total - b.remaining) - (a.total - a.remaining))
        break
      case 'highToLow':
        list = [...list].sort((a, b) => (b.cost ?? 0) - (a.cost ?? 0))
        break
      case 'lowToHigh':
        list = [...list].sort((a, b) => (a.cost ?? 0) - (b.cost ?? 0))
        break
      default:
        break
    }
    return list
  }, [activeCategoryId, selectedFilterTags, sortBy])

  const currentSortLabel = SORT_OPTIONS.find((o) => o.id === sortBy)?.label ?? '推薦訂單'

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
            <button type="button" className="header-link" onClick={() => setShowAccount(true)}>
              my page
            </button>
            {isLoggedIn ? (
              <button type="button" className="btn-login" onClick={logout}>
                {user?.name} · 登出
              </button>
            ) : (
              <Link to="/login" className="btn-login btn-login-link">
                會員註冊/登錄
              </Link>
            )}
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
            className={`nav-link ${cat.id === activeCategoryId ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault()
              setActiveCategoryId(cat.id)
            }}
          >
            {cat.label}
          </Link>
        ))}
      </nav>

      {/* Toolbar: Filter + Sort */}
      <div className="gacha-toolbar">
        <button
          type="button"
          className="toolbar-filter-btn"
          onClick={() => setFilterModalOpen(true)}
        >
          <span className="toolbar-filter-icon" aria-hidden>☰</span>
          篩選
        </button>
        <div className="toolbar-sort">
          <button
            type="button"
            className="toolbar-sort-trigger"
            onClick={() => setSortDropdownOpen((o) => !o)}
            aria-expanded={sortDropdownOpen}
            aria-haspopup="listbox"
          >
            {currentSortLabel}
            <span className="toolbar-sort-arrow">▼</span>
          </button>
          {sortDropdownOpen && (
            <>
              <div className="toolbar-sort-backdrop" onClick={() => setSortDropdownOpen(false)} />
              <ul className="toolbar-sort-dropdown" role="listbox">
                {SORT_OPTIONS.map((option) => (
                  <li key={option.id} role="option" aria-selected={sortBy === option.id}>
                    <button
                      type="button"
                      className={sortBy === option.id ? 'sort-option sort-option--active' : 'sort-option'}
                      onClick={() => {
                        setSortBy(option.id)
                        setSortDropdownOpen(false)
                      }}
                    >
                      {sortBy === option.id && <span className="sort-check">✓</span>}
                      {option.label}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>

      {/* Main Content - Gacha Event Cards */}
      <main className="gacha-content">
        {filteredAndSortedEvents.map((event) => {
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

      <FilterModal
        open={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        filterTagCategories={FILTER_TAG_CATEGORIES}
        selectedTags={selectedFilterTags}
        onApply={setSelectedFilterTags}
      />
      <AccountOverlay open={showAccount} onClose={() => setShowAccount(false)} />
    </div>
  )
}

export default MainGachaPage
