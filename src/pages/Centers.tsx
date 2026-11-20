import { useEffect, useState } from 'react'
import { fetchCenters, type Center } from '../api'
import { useLang } from '../store/LangContext'

export default function Centers() {
  const { t, pick } = useLang()
  const [centers, setCenters] = useState<Center[]>([])

  useEffect(() => {
    fetchCenters().then(setCenters).catch(() => setCenters([]))
  }, [])

  return (
    <>
      <h1 className="section-title">{t('trainingCenters')}</h1>
      <div className="grid">
        {centers.map((c) => (
          <div key={c.id} className="card">
            <span className="badge">{c.code}</span>
            <h3>{pick(c.name, c.name_bn)}</h3>
            <p className="muted">{[c.district, c.phone].filter(Boolean).join(' · ')}</p>
            {c.address && <p>{c.address}</p>}
          </div>
        ))}
      </div>
      {!centers.length && <p className="empty">{t('noCenters')}</p>}
    </>
  )
}
