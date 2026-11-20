import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth'

export default function Login() {
  const { login, member } = useAuth()
  const nav = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (member) nav('/me', { replace: true })
  }, [member, nav])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await login(username.trim(), password)
      nav('/me')
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Login failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="card" style={{ maxWidth: 420, margin: '24px auto' }} onSubmit={submit}>
      <h1 className="section-title">Member login</h1>
      <p className="muted">Use your O-SMART username / phone and password.</p>
      <input className="input" placeholder="Username or phone" value={username} onChange={(e) => setUsername(e.target.value)} required />
      <input className="input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button className="btn" type="submit" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
      {error && <p className="muted" style={{ marginTop: 10 }}>{error}</p>}
    </form>
  )
}
