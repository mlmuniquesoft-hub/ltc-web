import { Link } from 'react-router-dom'
import { useAuth } from '../auth'

export default function Me() {
  const { member, enrollments, ready } = useAuth()

  if (!ready) return <p className="empty">Loading…</p>
  if (!member) {
    return (
      <p className="empty">
        Please <Link to="/login">login</Link> to see your LTC enrollments.
      </p>
    )
  }

  return (
    <>
      <h1 className="section-title">My classes</h1>
      <p className="muted">{member.name} · @{member.username}</p>
      <div className="grid" style={{ marginTop: 16 }}>
        {(enrollments as any[]).map((e) => (
          <div key={e.id} className="card">
            <span className="badge">{e.status} · {e.payment_method}</span>
            <h3>{e.course?.title || 'Course'}</h3>
            <p className="muted">{e.batch?.name || 'Batch TBA'} · {e.center?.name || ''}</p>
            <p className="muted">Amount ৳{Number(e.amount || 0).toLocaleString()}</p>
            <p className="muted">{e.code}</p>
          </div>
        ))}
      </div>
      {!enrollments.length && (
        <p className="empty">No enrollments yet. <Link to="/courses">Browse courses</Link></p>
      )}
    </>
  )
}
