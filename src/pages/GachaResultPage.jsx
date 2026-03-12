import { useEffect, useRef } from 'react'
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom'
import './GachaResultPage.css'
import gachaConfig from '../config/gachaConfig.json'
import { getPoolImageUrl } from '../config/pools'
import { usePlayerState } from '../hooks/usePlayerState'

function GachaResultPage() {
  const { eventId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { claimReward } = usePlayerState()

  const reward = location.state?.reward
  const rewards = location.state?.rewards ?? null
  const drawCount = location.state?.drawCount ?? 0
  const pool = location.state?.pool ?? null
  const isTrial = location.state?.isTrial
  const isMulti = Array.isArray(rewards) && rewards.length > 0

  const event = gachaConfig.events.find((e) => e.id === eventId)
  const rewardImageUrl = pool && reward?.image ? getPoolImageUrl(pool, reward.image) : ''

  if (!event || (!reward && !isMulti)) {
    return (
      <div className="gacha-result-page">
        <div className="result-inner">
          <h1 className="result-title">沒有找到抽獎結果</h1>
          <p className="result-hint">請從扭蛋頁重新抽卡。</p>
          <Link to="/" className="result-btn-secondary">
            回到扭蛋首頁
          </Link>
        </div>
      </div>
    )
  }

  const rarityClass = reward ? `reward-rarity--${(reward.rarity || '').toLowerCase()}` : ''

  const hasAutoClaimedRef = useRef(false)

  useEffect(() => {
    if (isTrial || hasAutoClaimedRef.current) return
    if (isMulti) {
      rewards.forEach((r) => claimReward({ eventId, reward: r, isTrial: false }))
    } else if (reward) {
      claimReward({ eventId, reward, isTrial: false })
    }
    hasAutoClaimedRef.current = true
  }, [isTrial, isMulti, rewards, reward, claimReward, eventId])

  const handleDrawAgain = () => {
    const query = drawCount > 1 ? `?draws=${drawCount}` : isTrial ? '?trial=1' : ''
    navigate(`/gacha/${eventId}${query}`)
  }

  const handleClaimTrial = () => {
    if (isMulti) {
      rewards.forEach((r) => claimReward({ eventId, reward: r, isTrial: true }))
    } else if (reward) {
      claimReward({ eventId, reward, isTrial: true })
    }
  }

  return (
    <div className="gacha-result-page">
      <div className={`result-inner ${isMulti ? 'result-inner--multi' : ''}`}>
        <h1 className="result-title">抽獎結果</h1>
        <p className="result-subtitle">
          活動：{event.title}
          {isMulti && ` · 共 ${rewards.length} 張`}
        </p>

        {isMulti ? (
          <div className="reward-grid">
            {rewards.map((r, i) => {
              const imgUrl = pool && r.image ? getPoolImageUrl(pool, r.image) : ''
              const rClass = `reward-rarity--${(r.rarity || '').toLowerCase()}`
              return (
                <div key={`${r.id}-${i}`} className="reward-card reward-card--small">
                  <div className="reward-frame">
                    {imgUrl && (
                      <img className="reward-image" src={imgUrl} alt={r.name} />
                    )}
                    <div className={`reward-rarity ${rClass}`}>{r.rarity}</div>
                    <div className="reward-name">{r.name}</div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="reward-card">
            <div className="reward-glow" />
            <div className="reward-frame">
              {rewardImageUrl && (
                <img className="reward-image" src={rewardImageUrl} alt={reward.name} />
              )}
              <div className={`reward-rarity ${rarityClass}`}>
                {reward.rarity}
              </div>
              <div className="reward-name">{reward.name}</div>
              {reward.description && (
                <div className="reward-desc">{reward.description}</div>
              )}
            </div>
          </div>
        )}

        {isTrial ? (
          <p className="result-note">
            {isMulti
              ? '這是試用抽獎結果，按「領取全部」可將這些卡記錄在本機抽卡紀錄。'
              : '這是試用抽獎結果，按「領取此卡」可將卡片記錄在本機抽卡紀錄。'}
          </p>
        ) : (
          <p className="result-note">
            本次抽到的卡片已自動加入抽卡紀錄。
          </p>
        )}

        <div className="result-actions">
          {isTrial && (
            <button
              type="button"
              className="result-btn-primary"
              onClick={handleClaimTrial}
            >
              {isMulti ? '領取全部' : '領取此卡'}
            </button>
          )}

          <button
            type="button"
            className="result-btn-secondary"
            onClick={handleDrawAgain}
          >
            {isMulti ? `再抽${drawCount}次` : '再抽一次'}
          </button>

          <Link to="/" className="result-btn-secondary">
            回到扭蛋首頁
          </Link>
        </div>
      </div>
    </div>
  )
}

export default GachaResultPage
