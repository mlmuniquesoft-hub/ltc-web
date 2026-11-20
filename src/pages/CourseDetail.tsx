import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { enroll, fetchCourse, type Batch, type Course } from '../api'
import { useAuth } from '../auth'

export default function CourseDetail() {
  const { slug = '' } = useParams()
  const { member } = useAuth()
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
    }).catch((e) => setMsg(e?.response?.data?.message || 'Not found'))
  }, [slug])

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
      setMsg(res.message || 'Enrolled')
      if (res.data?.redirect_url) window.location.href = res.data.redirect_url
      else nav('/me')
    } catch (err: any) {
      setMsg(err?.response?.data?.message || err.message || 'Enroll failed')
    } finally {
      setBusy(false)
    }
  }

  if (!course) return <p className="empty">{msg || 'Loading…'}</p>

  return (
    <>
      <Link className="muted" to="/courses">← Courses</Link>
      <h1 className="section-title">{course.title}</h1>
      {course.title_bn && <p className="muted">{course.title_bn}</p>}
      <div className="card" style={{ marginBottom: 16 }}>
        <p>{course.summary || course.summary_bn}</p>
        <p className="muted">{course.language} · {course.level} · {course.mode} · {course.duration_weeks} weeks · {course.total_classes} classes</p>
        <p><strong>৳{Number(course.member_price || course.price).toLocaleString()}</strong> <span className="muted">member price</span></p>
        {!!course.highlights?.length && (
          <ul>{course.highlights.map((h) => <li key={h}>{h}</li>)}</ul>
        )}
      </div>

      <form className="card" onSubmit={submit}>
        <h3>Enroll</h3>
        <label className="muted">Batch</label>
        <select className="input" value={batchId} onChange={(e) => setBatchId(e.target.value ? Number(e.target.value) : '')}>
          <option value="">No batch yet</option>
          {(course.batches || []).map((b: Batch) => (
            <option key={b.id} value={b.id}>{b.name} · {b.center?.name || ''} · seats {b.seats_left}</option>
          ))}
        </select>
        <label className="muted">Payment</label>
        <select className="input" value={method} onChange={(e) => setMethod(e.target.value)}>
          <option value="pay_wallet">Pay Wallet</option>
          <option value="sslcommerz">SSLCommerz</option>
          <option value="cash">Cash at center</option>
        </select>
        {method === 'pay_wallet' && (
          <input className="input" type="password" placeholder="Account password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        )}
        {!member && <p className="muted">You will be asked to login as O-SMART member.</p>}
        <button className="btn" type="submit" disabled={busy}>{busy ? 'Please wait…' : 'Confirm enroll'}</button>
        {msg && <p className="muted" style={{ marginTop: 10 }}>{msg}</p>}
      </form>
    </>
  )
}
