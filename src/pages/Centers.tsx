import { useEffect, useState } from 'react'
import { fetchCenters, type Center } from '../api'

export default function Centers() {
  const [centers, setCenters] = useState<Center[]>([])

  useEffect(() => {
    fetchCenters().then(setCenters).catch(() => setCenters([]))
  }, [])

  return (
    <>
      <h1 className="section-title">Training centers</h1>
      <div className="grid">
        {centers.map((c) => (
          <div key={c.id} className="card">
            <span className="badge">{c.code}</span>
            <h3>{c.name}</h3>
            {c.name_bn && <p className="muted">{c.name_bn}</p>}
            <p className="muted">{[c.district, c.phone].filter(Boolean).join(' · ')}</p>
            {c.address && <p>{c.address}</p>}
          </div>
        ))}
      </div>
      {!centers.length && <p className="empty">No centers yet.</p>}
    </>
  )
}
