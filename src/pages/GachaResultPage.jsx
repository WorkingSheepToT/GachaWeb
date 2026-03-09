import { useLocation, useNavigate, useParams, Link } from 'react-router-dom'
import './GachaResultPage.css'
import gachaConfig from '../config/gachaConfig.json'
import { getPoolImageUrl } from '../config/pools'
import { usePlayerState } from '../hooks/usePlayerState'

function GachaResultPage() {
  const { eventId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { isMember, markAsMember, claimReward } = usePlayerState()

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

  const handleDrawAgain = () => {
    const query = drawCount > 1 ? `?draws=${drawCount}` : isTrial ? '?trial=1' : ''
    navigate(`/gacha/${eventId}${query}`)
  }

  const handleRegisterAndClaim = () => {
    markAsMember()
    if (isMulti) rewards.forEach((r) => claimReward({ eventId, reward: r }))
    else claimReward({ eventId, reward })
  }

  const handleClaimForMember = () => {
    if (isMulti) rewards.forEach((r) => claimReward({ eventId, reward: r }))
    else claimReward({ eventId, reward })
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

        {isTrial && !isMember && (
          <p className="result-note">
            {isMulti
              ? '這是試用抽獎結果，只有註冊成為會員並領取，這些卡才會真正發到你的帳號。'
              : '這是試用抽獎結果，只有註冊成為會員並領取，這張卡才會真正發到你的帳號。'}
          </p>
        )}

        {isTrial && isMember && (
          <p className="result-note">
            你已是會員，點「領取此卡」即可把卡片加入你的收藏（本機記錄）。
          </p>
        )}

        <div className="result-actions">
          {isTrial ? (
            isMember ? (
              <button
                type="button"
                className="result-btn-primary"
                onClick={handleClaimForMember}
              >
                {isMulti ? '領取全部' : '領取此卡'}
              </button>
            ) : (
              <button
                type="button"
                className="result-btn-primary"
                onClick={handleRegisterAndClaim}
              >
                {isMulti ? '註冊並領取全部' : '註冊並領取此卡'}
              </button>
            )
          ) : (
            <button
              type="button"
              className="result-btn-primary"
              onClick={handleClaimForMember}
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
