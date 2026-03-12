import { useEffect, useState } from 'react'
import {
  useParams,
  useSearchParams,
  useNavigate,
  useLocation,
  Link,
} from 'react-router-dom'
import './GachaDrawPage.css'
import { useGachaDraw } from '../hooks/useGachaDraw'
import { useAuth } from '../hooks/useAuth'

function GachaDrawPage() {
  const { eventId } = useParams()
  const [searchParams] = useSearchParams()
  const isTrial = searchParams.get('trial') === '1'
  const drawCount = Math.min(Math.max(1, parseInt(searchParams.get('draws') || '1', 10) || 1), 10)
  const isMultiDraw = drawCount > 1
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  const { event, draw, drawMultiple } = useGachaDraw(eventId)

  const [isSpinning, setIsSpinning] = useState(false)

  useEffect(() => {
    if (!isTrial && !user) {
      const redirect = encodeURIComponent(location.pathname + location.search)
      navigate(`/login?redirect=${redirect}`)
    }
  }, [isTrial, user, navigate, location])

  const handleDraw = () => {
    if (!event) return
    if (!isTrial && !user) return
    if (isSpinning) return

    const result = isMultiDraw
      ? drawMultiple({ isTrial, count: drawCount })
      : draw({ isTrial })

    if (!result) return
    if (isMultiDraw && (!result.rewards || result.rewards.length === 0)) return
    if (!isMultiDraw && !result.reward) return

    setIsSpinning(true)

    const delay = isMultiDraw ? 3500 : 2600
    window.setTimeout(() => {
      navigate(`/gacha/${eventId}/result`, {
        state: isMultiDraw
          ? {
              rewards: result.rewards,
              drawCount,
              pool: result.pool ?? null,
              eventId,
              isTrial,
            }
          : {
              reward: result.reward,
              pool: result.pool ?? null,
              eventId,
              isTrial,
            },
      })
    }, delay)
  }

  if (!event) {
    return (
      <div className="gacha-draw-page">
        <div className="draw-placeholder">
          <h1>找不到此扭蛋活動</h1>
          <p className="hint">請回到首頁重新選擇活動。</p>
          <Link to="/" className="btn-back">
            回到扭蛋首頁
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="gacha-draw-page">
      <div className="draw-layout">
        <header className="draw-header">
          <h1 className="draw-title">{event.title}</h1>
          {isTrial && <span className="draw-badge">試用抽獎（免費）</span>}
          {isMultiDraw && <span className="draw-badge draw-badge--count">抽{drawCount}次</span>}
        </header>

        <div className="machine-wrapper">
          <div className={`gacha-machine ${isSpinning ? 'gacha-machine--spinning' : ''}`}>
            <div className="machine-top" />
            <div className="machine-window">
              <div className="machine-ring" />
              <div className="machine-ball" />
              <div className="machine-sparkles" />
            </div>
            <div className="machine-base">
              <div className="machine-slot" />
            </div>
          </div>
        </div>

        <p className="hint">
          {isMultiDraw
            ? `按下「開始抽十次」後，扭蛋機會轉動，接著跳到獎勵頁顯示 ${drawCount} 張卡片。`
            : '按下「開始抽卡」後，扭蛋機會轉動數秒，接著自動跳到獎勵頁顯示抽到的卡片。'}
        </p>

        <div className="draw-actions">
          <button
            type="button"
            className="btn-draw-main"
            onClick={handleDraw}
            disabled={isSpinning}
          >
            {isSpinning ? '抽卡中…' : isMultiDraw ? `開始抽${drawCount}次` : '開始抽卡'}
          </button>
          <Link to="/" className="btn-back">
            回到扭蛋首頁
          </Link>
        </div>
      </div>
    </div>
  )
}

export default GachaDrawPage
