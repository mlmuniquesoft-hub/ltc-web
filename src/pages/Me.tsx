import { Link } from 'react-router-dom'
import { useAuth } from '../auth'
import { useLang } from '../store/LangContext'

export default function Me() {
  const { member, enrollments, ready } = useAuth()
  const { t, pick } = useLang()

  if (!ready) return <p className="empty">{t('loading')}</p>
  if (!member) {
    return (
      <p className="empty">
        {t('pleaseLogin')} <Link to="/login">{t('loginLink')}</Link> {t('toSeeEnrollments')}
      </p>
    )
  }

  return (
    <>
      <h1 className="section-title">{t('myClasses')}</h1>
      <p className="muted">{member.name} · @{member.username}</p>
      <div className="grid" style={{ marginTop: 16 }}>
        {(enrollments as any[]).map((e) => (
          <div key={e.id} className="card">
            <span className="badge">{e.status} · {e.payment_method}</span>
            <h3>{pick(e.course?.title || 'Course', e.course?.title_bn)}</h3>
            <p className="muted">{pick(e.batch?.name || t('batchTba'), e.batch?.name_bn)} · {e.center?.name || ''}</p>
            <p className="muted">{t('amount', { amount: Number(e.amount || 0).toLocaleString() })}</p>
            <p className="muted">{e.code}</p>
          </div>
        ))}
      </div>
      {!enrollments.length && (
        <p className="empty">{t('noEnrollments')} <Link to="/courses">{t('browseLink')}</Link></p>
      )}
    </>
  )
}
