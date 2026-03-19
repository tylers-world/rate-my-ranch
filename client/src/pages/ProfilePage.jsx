import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { ScoreBadge } from '../components/StarRating'

export default function ProfilePage() {
  const { username } = useParams()
  const { user: currentUser } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editingBio, setEditingBio] = useState(false)
  const [bioText, setBioText] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const loadProfile = async () => {
    try {
      const res = await axios.get(`/api/users/${username}`)
      setProfile(res.data)
      setBioText(res.data.user.bio || '')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setLoading(true)
    loadProfile()
  }, [username])

  const saveBio = async () => {
    try {
      await axios.put(`/api/users/${username}/bio`, { bio: bioText })
      setProfile(prev => ({ ...prev, user: { ...prev.user, bio: bioText } }))
      setEditingBio(false)
    } catch (err) {
      console.error(err)
    }
  }

  const deleteReview = async (reviewId) => {
    try {
      await axios.delete(`/api/users/reviews/${reviewId}`)
      setDeleteConfirm(null)
      loadProfile()
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center text-gray-text">
        <div className="w-8 h-8 border-3 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p>Loading profile...</p>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <p className="text-xl font-bold text-dark">User not found</p>
        <Link to="/" className="text-brand hover:underline mt-2 inline-block">Back to home</Link>
      </div>
    )
  }

  const { user, stats, personality, achievements, favoriteRanch, reviews, isOwner } = profile

  const memberSince = new Date(user.created_at).toLocaleDateString('en-US', {
    month: 'long', year: 'numeric'
  })

  return (
    <div>
      {/* Profile Header */}
      <div className="bg-brand py-12">
        <div className="max-w-4xl mx-auto px-4 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-white text-brand font-extrabold text-4xl flex items-center justify-center border-4 border-white/50 mb-4">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <h1 className="font-display text-3xl font-extrabold text-white tracking-tight">{user.username}</h1>
          <p className="text-white/70 text-sm mt-1">Member since {memberSince}</p>

          {personality && (
            <span className={`mt-3 px-4 py-1.5 rounded-full text-sm font-bold ${personality.color}`}>
              {personality.label}
            </span>
          )}

          {/* Bio */}
          <div className="mt-4 max-w-md w-full">
            {editingBio ? (
              <div className="flex flex-col gap-2">
                <textarea
                  value={bioText}
                  onChange={(e) => setBioText(e.target.value.slice(0, 150))}
                  placeholder="Tell us about your ranch journey..."
                  rows={2}
                  className="w-full px-4 py-2 rounded-lg border-0 text-dark text-sm text-center resize-none focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <div className="flex items-center justify-center gap-2">
                  <span className="text-white/50 text-xs">{bioText.length}/150</span>
                  <button onClick={saveBio} className="px-4 py-1 rounded-full bg-white text-brand text-sm font-bold border-0 cursor-pointer hover:bg-gray-100">Save</button>
                  <button onClick={() => { setEditingBio(false); setBioText(user.bio || '') }} className="px-4 py-1 rounded-full bg-white/20 text-white text-sm font-medium border-0 cursor-pointer hover:bg-white/30">Cancel</button>
                </div>
              </div>
            ) : (
              <>
                {user.bio && <p className="text-white/80 text-sm">{user.bio}</p>}
                {isOwner && (
                  <button
                    onClick={() => setEditingBio(true)}
                    className="mt-2 px-4 py-1.5 rounded-full bg-white/20 text-white text-sm font-medium border-0 cursor-pointer hover:bg-white/30 transition-colors"
                  >
                    {user.bio ? 'Edit Profile' : 'Add Bio'}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Ranches Rated" value={stats.totalReviews} />
          <StatCard label="Restaurants" value={stats.restaurantsReviewed} />
          <StatCard label="Avg Score" value={stats.avgScore ? `${stats.avgScore} ★` : '—'} />
          <StatCard label="Helpful Votes" value={stats.helpfulVotes} />
        </div>

        {/* Favorite Ranch */}
        {favoriteRanch && (
          <section>
            <h2 className="font-display text-lg font-extrabold text-dark mb-3">Favorite Ranch</h2>
            <Link to={`/restaurant/${favoriteRanch.restaurant_id}`} className="block no-underline">
              <div className="bg-white rounded-lg border border-gray-border p-5 shadow-sm hover:shadow-md transition-shadow flex gap-4 items-start">
                <ScoreBadge value={favoriteRanch.score} large />
                <div className="flex-1 min-w-0">
                  <h3 className="font-extrabold text-dark text-lg">{favoriteRanch.restaurant_name}</h3>
                  <span className="inline-block bg-brand-bg text-brand text-xs font-bold px-2.5 py-1 rounded-full mt-1">{favoriteRanch.ranch_brand}</span>
                  {favoriteRanch.review_text && (
                    <p className="text-sm text-gray-text mt-2 line-clamp-2">"{favoriteRanch.review_text}"</p>
                  )}
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Trophy Case */}
        <section>
          <h2 className="font-display text-lg font-extrabold text-dark mb-3">Trophy Case</h2>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
            {achievements.map((a) => (
              <div
                key={a.id}
                className={`rounded-lg p-4 text-center transition-all ${
                  a.earned
                    ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-amber-200 shadow-sm'
                    : 'bg-gray-light border border-gray-border opacity-50'
                }`}
                title={a.desc}
              >
                <div className="text-2xl mb-1">
                  {a.earned ? a.emoji : '🔒'}
                </div>
                <p className={`text-xs font-bold leading-tight ${a.earned ? 'text-dark' : 'text-gray-text'}`}>
                  {a.name}
                </p>
                <p className="text-[10px] text-gray-text mt-0.5 leading-tight">{a.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Review History */}
        <section>
          <h2 className="font-display text-lg font-extrabold text-dark mb-3">
            Review History ({reviews.length})
          </h2>
          {reviews.length === 0 ? (
            <div className="bg-gray-bg rounded-lg p-10 text-center text-gray-text">
              <p className="font-semibold">No reviews yet</p>
              <p className="text-sm mt-1">
                {isOwner ? (
                  <Link to="/" className="text-brand hover:underline">Find a restaurant to rate!</Link>
                ) : (
                  'This user hasn\'t reviewed any ranches yet.'
                )}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-border overflow-hidden">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-border last:border-0 p-5 flex gap-4">
                  <ScoreBadge value={review.overall_score} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Link to={`/restaurant/${review.restaurant_id}`} className="font-bold text-brand text-sm hover:underline">
                        {review.restaurant_name}
                      </Link>
                      <span className="inline-block bg-gray-light text-gray-text text-xs font-medium px-2 py-0.5 rounded-full">
                        {review.ranch_brand}
                      </span>
                      <span className="text-xs text-gray-text/60 ml-auto shrink-0">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-2">
                      <RatingPill label="Flavor" score={review.flavor_score} />
                      <RatingPill label="Thickness" score={review.thickness_score} />
                      <RatingPill label="Chill" score={review.chill_score} />
                      <RatingPill label="Dip-ability" score={review.dipability_score} />
                    </div>

                    {review.review_text && (
                      <p className="text-sm text-dark leading-relaxed mb-2">{review.review_text}</p>
                    )}

                    {review.photo_url && (
                      <img src={review.photo_url} alt="Review" className="w-full max-h-40 object-cover rounded-lg mb-2" />
                    )}

                    <div className="flex items-center gap-3 text-xs text-gray-text pt-1">
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"/></svg>
                        {review.upvotes} helpful
                      </span>

                      {isOwner && (
                        <>
                          {deleteConfirm === review.id ? (
                            <span className="ml-auto flex items-center gap-2">
                              <span className="text-accent-red font-medium">Delete this review?</span>
                              <button
                                onClick={() => deleteReview(review.id)}
                                className="px-2 py-0.5 rounded bg-accent-red text-white text-xs font-bold border-0 cursor-pointer"
                              >
                                Yes
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(null)}
                                className="px-2 py-0.5 rounded bg-gray-light text-dark text-xs font-bold border-0 cursor-pointer"
                              >
                                No
                              </button>
                            </span>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirm(review.id)}
                              className="ml-auto text-accent-red/60 hover:text-accent-red text-xs cursor-pointer border-0 bg-transparent font-medium"
                            >
                              Delete
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-lg border border-gray-border p-4 text-center shadow-sm">
      <p className="font-extrabold text-2xl text-brand">{value}</p>
      <p className="text-xs text-gray-text font-semibold uppercase tracking-wider mt-1">{label}</p>
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
