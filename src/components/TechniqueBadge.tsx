import { RISK_COLOR, techniqueById } from '../data/techniques'

export default function TechniqueBadge({ id }: { id: string }) {
  const t = techniqueById(id)
  if (!t) return null
  return (
    <span
      title={`${t.name} — ${t.riskNotes}`}
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${RISK_COLOR[t.risk]}`}
    >
      {t.name}
    </span>
  )
}
