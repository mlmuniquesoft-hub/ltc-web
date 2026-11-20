import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchHome, type Batch, type Center, type Course } from '../api'
import { useLang } from '../store/LangContext'

export default function Home() {
  const { t, pick } = useLang()
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
      .catch((e) => setError(e?.response?.data?.message || e.message || t('failedLoad')))
  }, [t])

  return (
    <>
      <section className="hero">
        <h1>{t('heroTitle')}</h1>
        <p>{t('heroSub')}</p>
        <div className="row" style={{ marginTop: 16 }}>
          <Link className="btn" to="/courses">{t('browseCourses')}</Link>
          <Link className="btn ghost" to="/centers" style={{ background: 'rgba(255,255,255,.15)', color: '#fff', borderColor: 'rgba(255,255,255,.35)' }}>
            {t('findCenter')}
          </Link>
        </div>
      </section>

      {error && <p className="empty">{error}</p>}

      <h2 className="section-title">{t('featuredCourses')}</h2>
      <div className="grid">
        {courses.map((c) => (
          <Link key={c.id} className="card" to={`/courses/${c.slug}`}>
            <span className="badge">{c.language} · {c.level}</span>
            <h3>{pick(c.title, c.title_bn)}</h3>
            <p className="muted">
              {t('weeks', { n: c.duration_weeks })} · ৳{Number(c.member_price || c.price).toLocaleString()}
            </p>
          </Link>
        ))}
        {!courses.length && !error && <p className="empty">{t('loadingCourses')}</p>}
      </div>

      <h2 className="section-title" style={{ marginTop: 28 }}>{t('upcomingBatches')}</h2>
      <div className="grid">
        {batches.slice(0, 6).map((b) => (
          <div key={b.id} className="card">
            <h3>{pick(b.name, b.name_bn)}</h3>
            <p className="muted">{b.course?.title} · {b.center?.name}</p>
            <p className="muted">
              {b.schedule_label || t('scheduleTba')} · {t('seats', { n: b.seats_left })}
            </p>
          </div>
        ))}
      </div>

      <h2 className="section-title" style={{ marginTop: 28 }}>{t('centers')}</h2>
      <div className="grid">
        {centers.map((c) => (
          <div key={c.id} className="card">
            <h3>{pick(c.name, c.name_bn)}</h3>
            <p className="muted">{c.district}{c.phone ? ` · ${c.phone}` : ''}</p>
            {c.address && <p className="muted">{c.address}</p>}
          </div>
        ))}
      </div>
    </>
  )
}
