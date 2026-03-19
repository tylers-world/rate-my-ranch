import { useState } from 'react'

export default function StarRating({ value = 0, onChange, size = 'text-xl', readonly = false }) {
  const [hover, setHover] = useState(0)
  const display = hover || value

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${size} select-none ${readonly ? 'cursor-default' : ''}`}
          style={{ color: star <= display ? '#6B9EFF' : '#D1D5DB' }}
          onClick={() => !readonly && onChange?.(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
        >
          ★
        </span>
      ))}
    </div>
  )
}

export function StarDisplay({ value, size = 'text-lg' }) {
  const full = Math.floor(value || 0)
  const partial = (value || 0) - full

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`${size} select-none`}
            style={{ color: star <= full ? '#6B9EFF' : (star === full + 1 && partial >= 0.5) ? '#6B9EFF' : '#D1D5DB' }}
          >
            ★
          </span>
        ))}
      </div>
      <span className="text-sm font-bold text-dark ml-1">{value ? Number(value).toFixed(1) : 'N/A'}</span>
    </div>
  )
}

export function ScoreBadge({ value, large = false }) {
  const num = Number(value) || 0
  const bg = num >= 4 ? 'bg-score-green' : num >= 3 ? 'bg-score-yellow' : 'bg-score-red'
  const sz = large ? 'w-16 h-16 text-2xl' : 'w-10 h-10 text-base'
  return (
    <div className={`${bg} ${sz} rounded-lg flex items-center justify-center text-white font-extrabold shrink-0`}>
      {num ? num.toFixed(1) : 'N/A'}
    </div>
  )
}
