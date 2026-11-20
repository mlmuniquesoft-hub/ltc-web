import { Link, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './auth'
import { useLang } from './store/LangContext'

function LangToggle() {
  const { lang, setLang } = useLang()
  return (
    <div className="lang-toggle">
      {(['BN', 'EN'] as const).map((l) => (
        <button key={l} type="button" className={lang === l ? 'on' : ''} onClick={() => setLang(l)}>
          {l}
        </button>
      ))}
    </div>
  )
}

export default function Layout() {
  const { member, logout } = useAuth()
  const { t } = useLang()
  const loc = useLocation()
  const link = (to: string, label: string) => (
    <Link className={`btn ghost${loc.pathname === to ? ' active' : ''}`} to={to}>{label}</Link>
  )

  return (
    <div className="shell">
      <header className="topnav">
        <Link to="/" className="brand">{t('brand')}</Link>
        <nav className="navlinks">
          <LangToggle />
          {link('/', t('navHome'))}
          {link('/courses', t('navCourses'))}
          {link('/centers', t('navCenters'))}
          {member ? (
            <>
              {link('/me', t('navMe'))}
              <button type="button" className="btn ghost" onClick={logout}>{t('navLogout')}</button>
            </>
          ) : (
            link('/login', t('navLogin'))
          )}
        </nav>
      </header>
      <Outlet />
      <footer className="muted" style={{ marginTop: 28, textAlign: 'center' }}>
        {t('footer')}
      </footer>
    </div>
  )
}
