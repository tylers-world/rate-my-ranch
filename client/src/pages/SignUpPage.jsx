import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function SignUpPage() {
  const navigate = useNavigate()
  const { signup } = useAuth()
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const validate = () => {
    const errors = {}
    if (!form.username.trim()) errors.username = 'Username is required'
    else if (form.username.length < 3) errors.username = 'Username must be at least 3 characters'
    else if (!/^[a-zA-Z0-9_]+$/.test(form.username)) errors.username = 'Letters, numbers, and underscores only'

    if (!form.email.trim()) errors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Please enter a valid email'

    if (!form.password) errors.password = 'Password is required'
    else if (form.password.length < 6) errors.password = 'Password must be at least 6 characters'

    if (form.password !== form.confirmPassword) errors.confirmPassword = 'Passwords do not match'

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!validate()) return

    setSubmitting(true)
    try {
      await signup(form.username, form.email, form.password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Sign up failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const update = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value })
    if (fieldErrors[field]) setFieldErrors({ ...fieldErrors, [field]: '' })
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-bg px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-extrabold text-dark tracking-tight">Join RateMyRanch</h1>
          <p className="text-gray-text mt-2">Create an account to rate and review ranch</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-border p-6 shadow-sm space-y-4">
          {error && (
            <div className="bg-accent-red/10 text-accent-red px-4 py-2.5 rounded-lg text-sm font-medium">{error}</div>
          )}

          <div>
            <label className="block text-sm font-bold text-dark mb-1.5">Username</label>
            <input
              type="text"
              placeholder="ranch_lover_99"
              value={form.username}
              onChange={update('username')}
              className={`w-full px-4 py-2.5 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand text-dark ${fieldErrors.username ? 'border-accent-red' : 'border-gray-border'}`}
            />
            {fieldErrors.username && <p className="text-accent-red text-xs mt-1 font-medium">{fieldErrors.username}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-dark mb-1.5">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={update('email')}
              className={`w-full px-4 py-2.5 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand text-dark ${fieldErrors.email ? 'border-accent-red' : 'border-gray-border'}`}
            />
            {fieldErrors.email && <p className="text-accent-red text-xs mt-1 font-medium">{fieldErrors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-dark mb-1.5">Password</label>
            <input
              type="password"
              placeholder="At least 6 characters"
              value={form.password}
              onChange={update('password')}
              className={`w-full px-4 py-2.5 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand text-dark ${fieldErrors.password ? 'border-accent-red' : 'border-gray-border'}`}
            />
            {fieldErrors.password && <p className="text-accent-red text-xs mt-1 font-medium">{fieldErrors.password}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-dark mb-1.5">Confirm Password</label>
            <input
              type="password"
              placeholder="Re-enter your password"
              value={form.confirmPassword}
              onChange={update('confirmPassword')}
              className={`w-full px-4 py-2.5 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand text-dark ${fieldErrors.confirmPassword ? 'border-accent-red' : 'border-gray-border'}`}
            />
            {fieldErrors.confirmPassword && <p className="text-accent-red text-xs mt-1 font-medium">{fieldErrors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-brand hover:bg-brand-dark text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 border-0 text-base cursor-pointer"
          >
            {submitting ? 'Creating Account...' : 'Sign Up'}
          </button>

          <p className="text-center text-sm text-gray-text">
            Already have an account?{' '}
            <Link to="/login" className="text-brand font-semibold hover:underline">Log In</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
