import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { enroll, fetchCourse, type Batch, type Course } from '../api'
import { useAuth } from '../auth'
import { useLang } from '../store/LangContext'

export default function CourseDetail() {
  const { slug = '' } = useParams()
  const { member } = useAuth()
  const { t, pick } = useLang()
  const nav = useNavigate()
  const [course, setCourse] = useState<Course | null>(null)
  const [batchId, setBatchId] = useState<number | ''>('')
  const [method, setMethod] = useState('pay_wallet')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    fetchCourse(slug).then((c) => {
      setCourse(c)
      if (c.batches?.[0]) setBatchId(c.batches[0].id)
    }).catch((e) => setMsg(e?.response?.data?.message || t('notFound')))
  }, [slug, t])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!member) {
      nav('/login')
      return
    }
    setBusy(true)
    setMsg('')
    try {
      const res = await enroll(slug, {
        batch_id: batchId || undefined,
        payment_method: method,
        password: method === 'pay_wallet' ? password : undefined,
      })
      setMsg(res.message || t('enrolled'))
      if (res.data?.redirect_url) window.location.href = res.data.redirect_url
      else nav('/me')
    } catch (err: any) {
      setMsg(err?.response?.data?.message || err.message || t('enrollFailed'))
    } finally {
      setBusy(false)
    }
  }

  if (!course) return <p className="empty">{msg || t('loading')}</p>

  return (
    <>
      <Link className="muted" to="/courses">{t('backCourses')}</Link>
      <h1 className="section-title">{pick(course.title, course.title_bn)}</h1>
      <div className="card" style={{ marginBottom: 16 }}>
        <p>{pick(course.summary || '', course.summary_bn)}</p>
        <p className="muted">
          {course.language} · {course.level} · {course.mode} · {t('weeks', { n: course.duration_weeks })} · {t('classesCount', { n: course.total_classes })}
        </p>
        <p>
          <strong>৳{Number(course.member_price || course.price).toLocaleString()}</strong>{' '}
          <span className="muted">{t('memberLabel')}</span>
        </p>
        {!!course.highlights?.length && (
          <ul>{course.highlights.map((h) => <li key={h}>{h}</li>)}</ul>
        )}
      </div>

      <form className="card" onSubmit={submit}>
        <h3>{t('enroll')}</h3>
        <label className="muted">{t('batch')}</label>
        <select className="input" value={batchId} onChange={(e) => setBatchId(e.target.value ? Number(e.target.value) : '')}>
          <option value="">{t('noBatchYet')}</option>
          {(course.batches || []).map((b: Batch) => (
            <option key={b.id} value={b.id}>
              {pick(b.name, b.name_bn)} · {b.center?.name || ''} · {t('seats', { n: b.seats_left })}
            </option>
          ))}
        </select>
        <label className="muted">{t('payment')}</label>
        <select className="input" value={method} onChange={(e) => setMethod(e.target.value)}>
          <option value="pay_wallet">{t('payWallet')}</option>
          <option value="sslcommerz">{t('sslcommerz')}</option>
          <option value="cash">{t('cash')}</option>
        </select>
        {method === 'pay_wallet' && (
          <input className="input" type="password" placeholder={t('accountPassword')} value={password} onChange={(e) => setPassword(e.target.value)} required />
        )}
        {!member && <p className="muted">{t('loginToEnroll')}</p>}
        <button className="btn" type="submit" disabled={busy}>{busy ? t('pleaseWait') : t('confirmEnroll')}</button>
        {msg && <p className="muted" style={{ marginTop: 10 }}>{msg}</p>}
      </form>
    </>
  )
}
