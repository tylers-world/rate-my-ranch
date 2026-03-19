import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Check for redirect message
  const redirectMessage = location.state?.message

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.email || !form.password) {
      setError('Email and password are required')
      return
    }

    setSubmitting(true)
    try {
      await login(form.email, form.password)
      // Redirect to where they came from, or homepage
      const from = location.state?.from || '/'
      navigate(from)
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-bg px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-extrabold text-dark tracking-tight">Log In</h1>
          <p className="text-gray-text mt-2">Welcome back to RateMyRanch</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-border p-6 shadow-sm space-y-4">
          {redirectMessage && (
            <div className="bg-brand-bg text-brand px-4 py-2.5 rounded-lg text-sm font-medium">{redirectMessage}</div>
          )}

          {error && (
            <div className="bg-accent-red/10 text-accent-red px-4 py-2.5 rounded-lg text-sm font-medium">{error}</div>
          )}

          <div>
            <label className="block text-sm font-bold text-dark mb-1.5">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand text-dark"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-dark mb-1.5">Password</label>
            <input
              type="password"
              placeholder="Your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand text-dark"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-brand hover:bg-brand-dark text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 border-0 text-base cursor-pointer"
          >
            {submitting ? 'Logging in...' : 'Log In'}
          </button>

          <p className="text-center text-sm text-gray-text">
            Don't have an account?{' '}
            <Link to="/signup" className="text-brand font-semibold hover:underline">Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
