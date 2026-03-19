import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { StarDisplay, ScoreBadge } from '../components/StarRating'
import ReviewCard from '../components/ReviewCard'
import ReviewForm from '../components/ReviewForm'
import RanchReportCard from '../components/RanchReportCard'

export default function RestaurantPage() {
  const { id } = useParams()
  const [restaurant, setRestaurant] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    try {
      const [r, rv] = await Promise.all([
        axios.get(`/api/restaurants/${id}`),
        axios.get(`/api/reviews/restaurant/${id}`),
      ])
      setRestaurant(r.data)
      setReviews(rv.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { loadData() }, [loadData])

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center text-gray-text">
        <div className="w-8 h-8 border-3 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-lg">Loading restaurant...</p>
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <p className="text-xl text-dark font-bold">Restaurant not found</p>
        <Link to="/" className="text-brand hover:underline mt-2 inline-block font-semibold">Back to home</Link>
      </div>
    )
  }

  const r = restaurant

  return (
    <div>
      {/* Header */}
      <div className="bg-gray-bg border-b border-gray-border">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Link to="/" className="text-brand hover:underline text-sm font-medium mb-4 inline-block no-underline">
            ← Back to search
          </Link>

          <div className="flex items-start gap-6">
            <ScoreBadge value={r.avg_overall} large />

            <div className="flex-1">
              <h1 className="font-display text-3xl md:text-4xl font-extrabold text-dark m-0 tracking-tight">
                {r.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <span className="text-gray-text">{r.location}</span>
                <span className="inline-block bg-brand-bg text-brand text-xs font-bold px-3 py-1 rounded-full">
                  {r.cuisine_type}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <StarDisplay value={r.avg_overall} size="text-xl" />
                <span className="text-sm text-gray-text ml-1">
                  {r.review_count} rating{r.review_count !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Ranch Profile Tags */}
            <div className="bg-white rounded-lg border border-gray-border p-6 shadow-sm">
              <h2 className="font-display text-lg font-extrabold text-dark mb-4">Ranch Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gray-bg rounded-lg p-4 text-center">
                  <p className="text-xs text-gray-text uppercase font-bold tracking-wider mb-1">Brand</p>
                  <p className="font-extrabold text-dark text-lg">{r.ranch_brand}</p>
                </div>
                <div className="bg-gray-bg rounded-lg p-4 text-center">
                  <p className="text-xs text-gray-text uppercase font-bold tracking-wider mb-1">Serving Style</p>
                  <p className="font-extrabold text-dark">{r.serving_style}</p>
                </div>
                <div className="bg-gray-bg rounded-lg p-4 text-center">
                  <p className="text-xs text-gray-text uppercase font-bold tracking-wider mb-1">Temperature</p>
                  <p className="font-extrabold text-dark">{r.ranch_temperature}</p>
                </div>
              </div>
            </div>

            {/* Review Form */}
            <ReviewForm restaurantId={r.id} onReviewAdded={loadData} />

            {/* Reviews List */}
            <div>
              <h2 className="font-display text-lg font-extrabold text-dark mb-4">
                {reviews.length} Student Rating{reviews.length !== 1 ? 's' : ''}
              </h2>
              {reviews.length === 0 ? (
                <div className="bg-gray-bg rounded-lg p-10 text-center text-gray-text">
                  <p className="font-semibold text-lg">No ratings yet</p>
                  <p className="text-sm mt-1">Be the first to rate this ranch!</p>
                </div>
              ) : (
                <div className="bg-white rounded-lg border border-gray-border overflow-hidden">
                  {reviews.map(rv => (
                    <div key={rv.id} className="px-5">
                      <ReviewCard review={rv} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <RanchReportCard restaurant={r} />
          </div>
        </div>
      </div>
    </div>
  )
}
