import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function AddRestaurantPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    location: '',
    cuisine_type: '',
    ranch_brand: '',
    serving_style: 'cup',
    ranch_temperature: 'cold',
  })
  const [photo, setPhoto] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.name || !form.location || !form.cuisine_type) {
      setError('Name, location, and cuisine type are required!')
      return
    }

    setSubmitting(true)
    try {
      const data = new FormData()
      Object.entries(form).forEach(([k, v]) => data.append(k, v))
      if (photo) data.append('photo', photo)

      const res = await axios.post('/api/restaurants', data)
      navigate(`/restaurant/${res.data.id}`)
    } catch (err) {
      setError('Failed to add restaurant. Try again!')
    } finally {
      setSubmitting(false)
    }
  }

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  return (
    <div>
      <div className="bg-brand py-10 text-center">
        <h1 className="font-display text-3xl font-extrabold text-white tracking-tight">Add a Restaurant</h1>
        <p className="text-white/80 mt-1">Know a place that serves ranch? Add it to the database!</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-border p-6 shadow-sm space-y-5">
          {error && (
            <div className="bg-accent-red/10 text-accent-red px-4 py-2.5 rounded-lg text-sm font-medium">{error}</div>
          )}

          <div>
            <label className="block text-sm font-bold text-dark mb-1.5">Restaurant Name *</label>
            <input
              type="text"
              placeholder="e.g. Big Buck's BBQ"
              value={form.name}
              onChange={update('name')}
              className="w-full px-4 py-2.5 border border-gray-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand text-dark"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-dark mb-1.5">Location *</label>
            <input
              type="text"
              placeholder="e.g. Austin, TX"
              value={form.location}
              onChange={update('location')}
              className="w-full px-4 py-2.5 border border-gray-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand text-dark"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-dark mb-1.5">Cuisine Type *</label>
            <input
              type="text"
              placeholder="e.g. BBQ, Wings, Pizza, American"
              value={form.cuisine_type}
              onChange={update('cuisine_type')}
              className="w-full px-4 py-2.5 border border-gray-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand text-dark"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-dark mb-1.5">Ranch Brand</label>
            <input
              type="text"
              placeholder="e.g. Hidden Valley, House-made, Ken's"
              value={form.ranch_brand}
              onChange={update('ranch_brand')}
              className="w-full px-4 py-2.5 border border-gray-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand text-dark"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-dark mb-1.5">Serving Style</label>
              <select
                value={form.serving_style}
                onChange={update('serving_style')}
                className="w-full px-4 py-2.5 border border-gray-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand text-dark"
              >
                <option value="cup">Cup</option>
                <option value="drizzle">Drizzle</option>
                <option value="bottle on table">Bottle on Table</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-dark mb-1.5">Temperature</label>
              <select
                value={form.ranch_temperature}
                onChange={update('ranch_temperature')}
                className="w-full px-4 py-2.5 border border-gray-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand text-dark"
              >
                <option value="cold">Cold</option>
                <option value="room temp">Room Temp</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-dark mb-1.5">Restaurant Photo (optional)</label>
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
            {submitting ? 'Adding...' : 'Add Restaurant'}
          </button>
        </form>
      </div>
    </div>
  )
}
