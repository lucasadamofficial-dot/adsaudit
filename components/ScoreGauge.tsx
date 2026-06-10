'use client'
  import { scoreColor, scoreLabel } from '@/lib/audit-engine'

    interface Props { score: number; size?: 'sm' | 'lg' }

    export default function ScoreGauge({ score, size = 'lg' }: Props) {
  const radius = size === 'lg' ? 54 : 36
  const stroke = size === 'lg' ? 10 : 7
  const circumference = 2 * Math.PI * radius
  const progress = (score / 100) * circumference
      const color = score >= 80 ? '#16a34a' : score >= 60 ? '#d97706' : '#dc2626'
      const dim = (radius + stroke) * 2
  return (
    <div className="flex flex-col items-center gap-1">
          <svg width={dim} height={dim} viewBox={`0 0 ${dim} ${dim}`} className="-rotate-90">
              <circle cx={dim/2} cy={dim/2} r={radius} fill="none" stroke="#e5e7eb" strokeWidth={stroke} />
              <circle cx={dim/2} cy={dim/2} r={radius} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={`${progress} ${circumference}`} strokeLinecap="round"
                style={{ transition: 'stroke-dasharray 0.6s ease' }} />
            </svg>
            <div className="flex flex-col items-center" style={{ marginTop: `-${dim/2+(size==='lg'?30:20)}px` }}>
        <span className={`font-semibold ${size==='lg'?'text-4xl':'text-xl'} ${scoreColor(score)}`}>{score}</span>
          {size === 'lg' && <span className="text-xs text-gray-500">{scoreLabel(score)}</span>}
      </div>
              </div>
  )
}
