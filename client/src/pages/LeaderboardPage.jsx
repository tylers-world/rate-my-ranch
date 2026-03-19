import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { ScoreBadge } from '../components/StarRating'

export default function LeaderboardPage() {
  const [top, setTop] = useState([])
  const [bottom, setBottom] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      axios.get('/api/leaderboard/top'),
      axios.get('/api/leaderboard/bottom'),
    ]).then(([t, b]) => {
      setTop(t.data)
      setBottom(b.data)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center text-gray-text">
        <div className="w-8 h-8 border-3 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p>Loading rankings...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="bg-brand py-12 text-center">
        <h1 className="font-display text-4xl font-extrabold text-white tracking-tight">Ranch Rankings</h1>
        <p className="text-white/80 mt-2 text-lg">The best and worst ranch in the land</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Hall of Fame */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-brand rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd"/></svg>
              </div>
              <div>
                <h2 className="font-display text-2xl font-extrabold text-dark">The Ranch Hall of Fame</h2>
                <p className="text-sm text-gray-text">Top rated ranch experiences</p>
              </div>
            </div>

            <div className="space-y-2">
              {top.map((r, i) => (
                <Link
                  key={r.id}
                  to={`/restaurant/${r.id}`}
                  className="flex items-center gap-4 bg-white rounded-lg p-4 hover:shadow-md transition-shadow no-underline border border-gray-border hover:border-brand/40"
                >
                  <span className="text-lg font-extrabold text-gray-text w-6 text-center shrink-0">
                    {i + 1}
                  </span>
                  <ScoreBadge value={r.avg_overall} />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-extrabold text-dark text-sm m-0 truncate">{r.name}</h3>
                    <p className="text-xs text-gray-text m-0">{r.location}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="inline-block bg-brand-bg text-brand text-xs font-bold px-2.5 py-1 rounded-full">
                      {r.ranch_brand}
                    </span>
                    <p className="text-xs text-gray-text mt-1">{r.review_count} ratings</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* The Watery Abyss */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-accent-red rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
              </div>
              <div>
                <h2 className="font-display text-2xl font-extrabold text-dark">The Watery Abyss</h2>
                <p className="text-sm text-accent-red font-semibold">Where ranch dreams go to die</p>
              </div>
            </div>

            <div className="space-y-2">
              {bottom.map((r, i) => (
                <Link
                  key={r.id}
                  to={`/restaurant/${r.id}`}
                  className="flex items-center gap-4 bg-white rounded-lg p-4 hover:shadow-md transition-shadow no-underline border border-gray-border hover:border-accent-red/40"
                >
                  <span className="text-lg font-extrabold text-gray-text w-6 text-center shrink-0">
                    {i + 1}
                  </span>
                  <ScoreBadge value={r.avg_overall} />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-extrabold text-dark text-sm m-0 truncate">{r.name}</h3>
                    <p className="text-xs text-gray-text m-0">{r.location}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="inline-block bg-accent-red/10 text-accent-red text-xs font-bold px-2.5 py-1 rounded-full">
                      {r.ranch_brand}
                    </span>
                    <p className="text-xs text-gray-text mt-1">{r.review_count} ratings</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
