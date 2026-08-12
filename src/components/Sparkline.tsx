import type { PricePoint } from '../types'

export default function Sparkline({ points, width = 280, height = 60 }: { points: PricePoint[]; width?: number; height?: number }) {
  if (points.length < 2) return null
  const prices = points.map((p) => p.price)
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  const span = max - min || 1
  const step = width / (points.length - 1)

  const path = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${(i * step).toFixed(1)},${(height - ((p.price - min) / span) * (height - 8) - 4).toFixed(1)}`)
    .join(' ')

  const last = points[points.length - 1].price
  const lastY = height - ((last - min) / span) * (height - 8) - 4

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" role="img" aria-label="30-day price history">
      <path d={path} fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinejoin="round" />
      <circle cx={width} cy={lastY} r="3" fill="#38bdf8" />
    </svg>
  )
}
