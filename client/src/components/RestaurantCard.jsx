import { Link } from 'react-router-dom'
import { ScoreBadge } from './StarRating'

export default function RestaurantCard({ restaurant }) {
  const r = restaurant

  return (
    <Link to={`/restaurant/${r.id}`} className="block no-underline group">
      <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-border p-5 flex gap-4 group-hover:border-brand/40">
        <ScoreBadge value={r.avg_overall} large />

        <div className="flex-1 min-w-0">
          <h3 className="font-display text-lg font-extrabold text-dark m-0 group-hover:text-brand transition-colors truncate">
            {r.name}
          </h3>
          <p className="text-sm text-gray-text mt-0.5">{r.location}</p>

          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="inline-block bg-brand-bg text-brand text-xs font-semibold px-2.5 py-1 rounded-full">
              {r.cuisine_type}
            </span>
            <span className="inline-block bg-gray-light text-gray-text text-xs font-medium px-2.5 py-1 rounded-full">
              {r.ranch_brand}
            </span>
            <span className="inline-block bg-gray-light text-gray-text text-xs font-medium px-2.5 py-1 rounded-full">
              {r.serving_style}
            </span>
          </div>

          <div className="flex items-center gap-3 mt-2 text-xs text-gray-text">
            <span>{r.review_count || 0} rating{r.review_count !== 1 ? 's' : ''}</span>
            <span className="text-gray-border">|</span>
            <span>{r.ranch_temperature}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
