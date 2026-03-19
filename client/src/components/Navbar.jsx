import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown on click outside
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Close dropdown on route change
  useEffect(() => {
    setDropdownOpen(false)
  }, [location.pathname])

  const linkClass = (path) =>
    `px-4 py-2 rounded-full text-sm font-semibold transition-colors no-underline ${
      location.pathname === path
        ? 'bg-white text-brand'
        : 'text-white/90 hover:bg-white/15'
    }`

  const handleLogout = () => {
    logout()
    setDropdownOpen(false)
    navigate('/')
  }

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

          {user ? (
            /* Logged-in user avatar + dropdown */
            <div className="relative ml-2" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-9 h-9 rounded-full bg-white text-brand font-extrabold text-sm flex items-center justify-center border-2 border-white/50 cursor-pointer hover:border-white transition-colors"
                title={user.username}
              >
                {user.username.charAt(0).toUpperCase()}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-12 w-52 bg-white rounded-lg shadow-lg border border-gray-border py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-border">
                    <p className="font-bold text-dark text-sm truncate">{user.username}</p>
                    <p className="text-xs text-gray-text truncate">{user.email}</p>
                  </div>
                  <Link
                    to={`/profile/${user.username}`}
                    className="block px-4 py-2 text-sm text-dark hover:bg-gray-bg transition-colors no-underline font-medium"
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-accent-red hover:bg-gray-bg transition-colors cursor-pointer border-0 bg-transparent font-medium"
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Guest auth buttons */
            <>
              <Link
                to="/login"
                className="px-4 py-2 rounded-full text-sm font-semibold text-white border border-white/40 hover:bg-white/15 transition-colors no-underline ml-1"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 rounded-full text-sm font-bold bg-white text-brand hover:bg-gray-100 transition-colors no-underline"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
