import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ScoreBadge } from './StarRating'
import axios from 'axios'

export default function ReviewCard({ review, showRestaurant = false }) {
  const [upvotes, setUpvotes] = useState(review.upvotes)
  const [downvotes, setDownvotes] = useState(review.downvotes)
  const [voted, setVoted] = useState(null)

  const handleVote = async (type) => {
    if (voted) return
    try {
      const res = await axios.post(`/api/reviews/${review.id}/${type}`)
      setUpvotes(res.data.upvotes)
      setDownvotes(res.data.downvotes)
      setVoted(type)
    } catch (err) {
      console.error('Vote failed:', err)
    }
  }

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    if (days < 30) return `${days}d ago`
    return new Date(dateStr).toLocaleDateString()
  }

  return (
    <div className="bg-white border-b border-gray-border py-5 flex gap-4">
      <ScoreBadge value={review.overall_score} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <Link to={`/profile/${review.reviewer_name}`} className="font-bold text-dark text-sm hover:text-brand transition-colors no-underline">
            {review.reviewer_name}
          </Link>
          {showRestaurant && review.restaurant_name && (
            <span className="text-gray-text text-sm">
              on{' '}
              <Link to={`/restaurant/${review.restaurant_id}`} className="text-brand hover:underline font-semibold">
                {review.restaurant_name}
              </Link>
            </span>
          )}
          <span className="text-xs text-gray-text/60 ml-auto shrink-0">{timeAgo(review.created_at)}</span>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-2.5">
          <RatingPill label="Flavor" score={review.flavor_score} />
          <RatingPill label="Thickness" score={review.thickness_score} />
          <RatingPill label="Chill" score={review.chill_score} />
          <RatingPill label="Dip-ability" score={review.dipability_score} />
        </div>

        {review.review_text && (
          <p className="text-sm text-dark leading-relaxed mb-2">{review.review_text}</p>
        )}

        {review.photo_url && (
          <img
            src={review.photo_url}
            alt="Review photo"
            className="w-full max-h-48 object-cover rounded-lg mb-2"
          />
        )}

        <div className="flex items-center gap-3 text-sm pt-1">
          <button
            onClick={() => handleVote('upvote')}
            disabled={!!voted}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-colors border text-sm cursor-pointer ${
              voted === 'upvote'
                ? 'bg-brand-bg text-brand border-brand/30'
                : 'border-gray-border text-gray-text hover:border-brand hover:text-brand bg-white'
            } ${voted && voted !== 'upvote' ? 'opacity-30' : ''}`}
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"/></svg>
            {upvotes}
          </button>
          <button
            onClick={() => handleVote('downvote')}
            disabled={!!voted}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-colors border text-sm cursor-pointer ${
              voted === 'downvote'
                ? 'bg-red-50 text-accent-red border-accent-red/30'
                : 'border-gray-border text-gray-text hover:border-accent-red hover:text-accent-red bg-white'
            } ${voted && voted !== 'downvote' ? 'opacity-30' : ''}`}
          >
            <svg className="w-3.5 h-3.5 rotate-180" fill="currentColor" viewBox="0 0 20 20"><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"/></svg>
            {downvotes}
          </button>
        </div>
      </div>
    </div>
  )
}

function RatingPill({ label, score }) {
  const bg = score >= 4 ? 'bg-score-green/10 text-score-green' :
             score >= 3 ? 'bg-score-yellow/10 text-score-yellow' :
             'bg-score-red/10 text-score-red'
  return (
    <span className={`${bg} text-xs font-bold px-2.5 py-1 rounded-full`}>
      {label}: {score}
    </span>
  )
}
