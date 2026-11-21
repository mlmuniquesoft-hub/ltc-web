import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { fetchMe, login as apiLogin } from './api'

type AuthState = {
  token: string | null
  member: { id: number; name: string; username: string; phone?: string } | null
  enrollments: unknown[]
  ready: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  refresh: () => Promise<void>
}

const Ctx = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('ltc_token'))
  const [member, setMember] = useState<AuthState['member']>(null)
  const [enrollments, setEnrollments] = useState<unknown[]>([])
  const [ready, setReady] = useState(false)

  const refresh = useCallback(async () => {
    if (!localStorage.getItem('ltc_token')) {
      setMember(null)
      setEnrollments([])
      return
    }
    const me = await fetchMe()
    setMember(me.member)
    setEnrollments(me.enrollments || [])
  }, [])

  useEffect(() => {
    (async () => {
      try {
        if (token) await refresh()
      } catch {
        localStorage.removeItem('ltc_token')
        setToken(null)
      } finally {
        setReady(true)
      }
    })()
  }, [token, refresh])

  const value = useMemo<AuthState>(() => ({
    token,
    member,
    enrollments,
    ready,
    async login(username, password) {
      const res = await apiLogin(username, password)
      const t = res.token || res.access_token || res.data?.token
      if (!t) throw new Error(res.message || 'Login failed')
      localStorage.setItem('ltc_token', t)
      setToken(t)
    },
    logout() {
      localStorage.removeItem('ltc_token')
      setToken(null)
      setMember(null)
      setEnrollments([])
    },
    refresh,
  }), [token, member, enrollments, ready, refresh])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useAuth() {
  const v = useContext(Ctx)
  if (!v) throw new Error('AuthProvider missing')
  return v
}
