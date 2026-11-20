import { Link, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './auth'

export default function Layout() {
  const { member, logout } = useAuth()
  const loc = useLocation()
  const link = (to: string, label: string) => (
    <Link className={`btn ghost${loc.pathname === to ? ' active' : ''}`} to={to}>{label}</Link>
  )

  return (
    <div className="shell">
      <header className="topnav">
        <Link to="/" className="brand">LTC · Language Training Center</Link>
        <nav className="navlinks">
          {link('/', 'Home')}
          {link('/courses', 'Courses')}
          {link('/centers', 'Centers')}
          {member ? (
            <>
              {link('/me', 'My classes')}
              <button type="button" className="btn ghost" onClick={logout}>Logout</button>
            </>
          ) : (
            link('/login', 'Member login')
          )}
        </nav>
      </header>
      <Outlet />
      <footer className="muted" style={{ marginTop: 28, textAlign: 'center' }}>
        language.osmartbd.com · part of O-SMART
      </footer>
    </div>
  )
}
