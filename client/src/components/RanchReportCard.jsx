import { ScoreBadge } from './StarRating'

export default function RanchReportCard({ restaurant }) {
  const r = restaurant
  if (!r.avg_overall) return null

  const getScoreColor = (score) => {
    if (score >= 4) return 'bg-score-green'
    if (score >= 3) return 'bg-score-yellow'
    return 'bg-score-red'
  }

  const categories = [
    { label: 'Flavor', score: r.avg_flavor },
    { label: 'Thickness', score: r.avg_thickness },
    { label: 'Chill Factor', score: r.avg_chill },
    { label: 'Dip-ability', score: r.avg_dipability },
  ]

  return (
    <div className="bg-white rounded-lg border border-gray-border p-6 shadow-sm">
      <h3 className="font-display text-lg font-extrabold text-dark mb-5">Ranch Report Card</h3>

      <div className="flex items-center justify-center mb-6">
        <div className="text-center">
          <ScoreBadge value={r.avg_overall} large />
          <p className="text-xs text-gray-text mt-2 font-semibold">OVERALL QUALITY</p>
        </div>
      </div>

      <div className="space-y-4">
        {categories.map(({ label, score }) => {
          const num = Number(score) || 0
          const pct = (num / 5) * 100
          return (
            <div key={label}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-semibold text-dark">{label}</span>
                <span className={`text-white text-xs font-extrabold px-2 py-0.5 rounded ${getScoreColor(num)}`}>
                  {num ? num.toFixed(1) : 'N/A'}
                </span>
              </div>
              <div className="w-full bg-gray-light rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${getScoreColor(num)}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-5 pt-4 border-t border-gray-border text-center">
        <p className="text-xs text-gray-text">Based on {r.review_count} rating{r.review_count !== 1 ? 's' : ''}</p>
      </div>
    </div>
  )
}
