import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth'
import { useLang } from '../store/LangContext'

export default function Login() {
  const { login, member } = useAuth()
  const { t } = useLang()
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
      setError(err?.response?.data?.message || err.message || t('loginFailed'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="card" style={{ maxWidth: 420, margin: '24px auto' }} onSubmit={submit}>
      <h1 className="section-title">{t('memberLogin')}</h1>
      <p className="muted">{t('loginHint')}</p>
      <input className="input" placeholder={t('usernamePhone')} value={username} onChange={(e) => setUsername(e.target.value)} required />
      <input className="input" type="password" placeholder={t('password')} value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button className="btn" type="submit" disabled={busy}>{busy ? t('signingIn') : t('signIn')}</button>
      {error && <p className="muted" style={{ marginTop: 10 }}>{error}</p>}
    </form>
  )
}
