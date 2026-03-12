import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import './LoginPage.css'
import { useAuth } from '../hooks/useAuth'

function LoginPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { loginAsTrial, isLoggedIn } = useAuth()

  const redirect = searchParams.get('redirect') || '/'

  const handleTrialLogin = () => {
    loginAsTrial()
    navigate(redirect, { replace: true })
  }

  if (isLoggedIn) {
    return (
      <div className="login-page">
        <div className="login-card">
          <h1>已登入</h1>
          <p>你已使用試用帳號登入，可以回到扭蛋頁繼續抽卡。</p>
          <button type="button" className="login-btn" onClick={() => navigate(redirect, { replace: true })}>
            回到上一頁
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>登入 / 註冊</h1>
        <p className="login-desc">
          目前提供<strong>試用帳號</strong>，登入後的抽卡紀錄會儲存在這台裝置的瀏覽器中。
        </p>

        <button type="button" className="login-btn" onClick={handleTrialLogin}>
          以試用帳號登入
        </button>

        <p className="login-note">
          之後可以再接上正式會員系統，目前先用本機試玩帳號體驗流程。
        </p>

        <Link to="/" className="login-link">
          回到扭蛋首頁
        </Link>
      </div>
    </div>
  )
}

export default LoginPage
