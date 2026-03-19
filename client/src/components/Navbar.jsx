import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const location = useLocation()

  const linkClass = (path) =>
    `px-4 py-2 rounded-full text-sm font-semibold transition-colors no-underline ${
      location.pathname === path
        ? 'bg-white text-brand'
        : 'text-white/90 hover:bg-white/15'
    }`

  return (
    <nav className="bg-brand shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 no-underline">
          <span className="text-white font-display text-xl font-extrabold tracking-tight">
            RateMyRanch
          </span>
        </Link>

        <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search restaurants..."
              className="w-full px-4 py-2 rounded-full bg-white/15 text-white placeholder-white/60 border border-white/20 focus:outline-none focus:bg-white/25 text-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.target.value) {
                  window.location.href = `/?search=${encodeURIComponent(e.target.value)}`
                }
              }}
            />
            <svg className="absolute right-3 top-2.5 w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/" className={linkClass('/')}>Home</Link>
          <Link to="/leaderboard" className={linkClass('/leaderboard')}>Rankings</Link>
          <Link
            to="/add"
            className="px-4 py-2 rounded-full text-sm font-bold bg-white text-brand hover:bg-gray-100 transition-colors no-underline"
          >
            + Add
          </Link>
        </div>
      </div>
    </nav>
  )
}
