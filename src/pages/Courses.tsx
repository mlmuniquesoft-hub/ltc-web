import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { fetchCourses, type Course } from '../api'

export default function Courses() {
  const [params, setParams] = useSearchParams()
  const [courses, setCourses] = useState<Course[]>([])
  const [q, setQ] = useState(params.get('q') || '')
  const [language, setLanguage] = useState(params.get('language') || '')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const query: Record<string, string> = {}
    if (params.get('q')) query.q = params.get('q')!
    if (params.get('language')) query.language = params.get('language')!
    fetchCourses(query)
      .then((res) => setCourses(res.data || []))
      .finally(() => setLoading(false))
  }, [params])

  const apply = (e: React.FormEvent) => {
    e.preventDefault()
    const next = new URLSearchParams()
    if (q.trim()) next.set('q', q.trim())
    if (language.trim()) next.set('language', language.trim())
    setParams(next)
  }

  return (
    <>
      <h1 className="section-title">All courses</h1>
      <form className="card" onSubmit={apply} style={{ marginBottom: 16 }}>
        <div className="row">
          <input className="input" style={{ flex: 1, marginBottom: 0 }} placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} />
          <input className="input" style={{ width: 160, marginBottom: 0 }} placeholder="Language" value={language} onChange={(e) => setLanguage(e.target.value)} />
          <button className="btn" type="submit">Filter</button>
        </div>
      </form>
      {loading && <p className="empty">Loading…</p>}
      <div className="grid">
        {courses.map((c) => (
          <Link key={c.id} className="card" to={`/courses/${c.slug}`}>
            <span className="badge">{c.mode} · {c.level}</span>
            <h3>{c.title}</h3>
            <p className="muted">{c.summary || c.summary_bn}</p>
            <p className="muted">৳{Number(c.member_price || c.price).toLocaleString()} member</p>
          </Link>
        ))}
      </div>
      {!loading && !courses.length && <p className="empty">No courses found.</p>}
    </>
  )
}
