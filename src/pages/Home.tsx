import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchHome, type Batch, type Center, type Course } from '../api'

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([])
  const [centers, setCenters] = useState<Center[]>([])
  const [batches, setBatches] = useState<Batch[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetchHome()
      .then((d) => {
        setCourses(d.featured_courses || [])
        setCenters(d.centers || [])
        setBatches(d.upcoming_batches || [])
      })
      .catch((e) => setError(e?.response?.data?.message || e.message || 'Failed to load'))
  }, [])

  return (
    <>
      <section className="hero">
        <h1>Learn languages with LTC</h1>
        <p>
          Spoken English, IELTS, Japanese, Korean, Arabic and more — batches across O-SMART centers.
          Enroll with Pay Wallet, SSLCommerz or cash at the center.
        </p>
        <div className="row" style={{ marginTop: 16 }}>
          <Link className="btn" to="/courses">Browse courses</Link>
          <Link className="btn ghost" to="/centers" style={{ background: 'rgba(255,255,255,.15)', color: '#fff', borderColor: 'rgba(255,255,255,.35)' }}>
            Find a center
          </Link>
        </div>
      </section>

      {error && <p className="empty">{error}</p>}

      <h2 className="section-title">Featured courses</h2>
      <div className="grid">
        {courses.map((c) => (
          <Link key={c.id} className="card" to={`/courses/${c.slug}`}>
            <span className="badge">{c.language} · {c.level}</span>
            <h3>{c.title}</h3>
            {c.title_bn && <p className="muted">{c.title_bn}</p>}
            <p className="muted">{c.duration_weeks} weeks · ৳{Number(c.member_price || c.price).toLocaleString()}</p>
          </Link>
        ))}
        {!courses.length && !error && <p className="empty">Loading courses…</p>}
      </div>

      <h2 className="section-title" style={{ marginTop: 28 }}>Upcoming batches</h2>
      <div className="grid">
        {batches.slice(0, 6).map((b) => (
          <div key={b.id} className="card">
            <h3>{b.name}</h3>
            <p className="muted">{b.course?.title} · {b.center?.name}</p>
            <p className="muted">{b.schedule_label || 'Schedule TBA'} · seats {b.seats_left}</p>
          </div>
        ))}
      </div>

      <h2 className="section-title" style={{ marginTop: 28 }}>Centers</h2>
      <div className="grid">
        {centers.map((c) => (
          <div key={c.id} className="card">
            <h3>{c.name}</h3>
            <p className="muted">{c.district}{c.phone ? ` · ${c.phone}` : ''}</p>
            {c.address && <p className="muted">{c.address}</p>}
          </div>
        ))}
      </div>
    </>
  )
}
