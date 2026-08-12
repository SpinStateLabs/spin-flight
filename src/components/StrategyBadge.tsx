import { RISK_COLOR, strategyById } from '../data/strategies'

export default function StrategyBadge({ id }: { id: string }) {
  const t = strategyById(id)
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
