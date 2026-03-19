import { useState } from 'react'
import StarRating from './StarRating'
import axios from 'axios'

export default function ReviewForm({ restaurantId, onReviewAdded }) {
  const [form, setForm] = useState({
    reviewer_name: '',
    overall_score: 0,
    flavor_score: 0,
    thickness_score: 0,
    chill_score: 0,
    dipability_score: 0,
    review_text: '',
  })
  const [photo, setPhoto] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.overall_score) {
      setError('Please give an overall ranch score!')
      return
    }

    setSubmitting(true)
    try {
      const data = new FormData()
      data.append('restaurant_id', restaurantId)
      data.append('reviewer_name', form.reviewer_name || 'Anonymous')
      data.append('overall_score', form.overall_score)
      data.append('flavor_score', form.flavor_score || form.overall_score)
      data.append('thickness_score', form.thickness_score || form.overall_score)
      data.append('chill_score', form.chill_score || form.overall_score)
      data.append('dipability_score', form.dipability_score || form.overall_score)
      data.append('review_text', form.review_text)
      if (photo) data.append('photo', photo)

      await axios.post('/api/reviews', data)
      setForm({
        reviewer_name: '',
        overall_score: 0,
        flavor_score: 0,
        thickness_score: 0,
        chill_score: 0,
        dipability_score: 0,
        review_text: '',
      })
      setPhoto(null)
      onReviewAdded?.()
    } catch (err) {
      setError('Failed to submit review. Try again!')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-border p-6 shadow-sm">
      <h3 className="font-display text-xl font-extrabold text-dark mb-5">Rate This Ranch</h3>

      {error && (
        <div className="bg-accent-red/10 text-accent-red px-4 py-2.5 rounded-lg mb-4 text-sm font-medium">{error}</div>
      )}

      <div className="mb-5">
        <label className="block text-sm font-semibold text-dark mb-1.5">Your Name</label>
        <input
          type="text"
          placeholder="Anonymous"
          value={form.reviewer_name}
          onChange={(e) => setForm({ ...form, reviewer_name: e.target.value })}
          className="w-full px-4 py-2.5 border border-gray-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand text-dark"
        />
      </div>

      <div className="mb-5">
        <label className="block text-sm font-semibold text-dark mb-2">Overall Ranch Score *</label>
        <StarRating
          value={form.overall_score}
          onChange={(v) => setForm({ ...form, overall_score: v })}
          size="text-3xl"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        {[
          { key: 'flavor_score', label: 'Flavor' },
          { key: 'thickness_score', label: 'Thickness' },
          { key: 'chill_score', label: 'Chill Factor' },
          { key: 'dipability_score', label: 'Dip-ability' },
        ].map(({ key, label }) => (
          <div key={key}>
            <label className="block text-sm font-semibold text-dark mb-1.5">{label}</label>
            <StarRating
              value={form[key]}
              onChange={(v) => setForm({ ...form, [key]: v })}
              size="text-xl"
            />
          </div>
        ))}
      </div>

      <div className="mb-5">
        <label className="block text-sm font-semibold text-dark mb-1.5">Your Review</label>
        <textarea
          placeholder="Tell us about the ranch experience..."
          value={form.review_text}
          onChange={(e) => setForm({ ...form, review_text: e.target.value })}
          rows={3}
          className="w-full px-4 py-2.5 border border-gray-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand text-dark resize-none"
        />
      </div>

      <div className="mb-5">
        <label className="block text-sm font-semibold text-dark mb-1.5">Photo (optional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files[0])}
          className="w-full text-sm text-gray-text file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand file:text-white hover:file:bg-brand-dark file:cursor-pointer"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-brand hover:bg-brand-dark text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 border-0 text-base cursor-pointer"
      >
        {submitting ? 'Submitting...' : 'Submit Rating'}
      </button>
    </form>
  )
}
