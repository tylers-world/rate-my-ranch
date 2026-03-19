import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import RestaurantCard from '../components/RestaurantCard'
import ReviewCard from '../components/ReviewCard'

export default function HomePage() {
  const [searchParams] = useSearchParams()
  const [restaurants, setRestaurants] = useState([])
  const [recentReviews, setRecentReviews] = useState([])
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [cuisineFilter, setCuisineFilter] = useState('')
  const [brandFilter, setBrandFilter] = useState('')
  const [sort, setSort] = useState('rating')
  const [cuisines, setCuisines] = useState([])
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [heroSearch, setHeroSearch] = useState('')

  useEffect(() => {
    Promise.all([
      axios.get('/api/restaurants/meta/cuisines'),
      axios.get('/api/restaurants/meta/brands'),
    ]).then(([c, b]) => {
      setCuisines(c.data)
      setBrands(b.data)
    })
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (cuisineFilter) params.set('cuisine', cuisineFilter)
    if (brandFilter) params.set('ranch_brand', brandFilter)
    if (sort) params.set('sort', sort)

    Promise.all([
      axios.get(`/api/restaurants?${params}`),
      axios.get('/api/reviews/recent?limit=5'),
    ]).then(([r, rv]) => {
      setRestaurants(r.data)
      setRecentReviews(rv.data)
    }).finally(() => setLoading(false))
  }, [search, cuisineFilter, brandFilter, sort])

  const handleHeroSearch = (e) => {
    e.preventDefault()
    setSearch(heroSearch)
  }

  return (
    <div>
      {/* Hero */}
      <div className="bg-brand py-20 text-center">
        <h1 className="font-display text-4xl md:text-5xl font-extrabold text-white mb-3 tracking-tight">
          Find the Best Ranch Near You
        </h1>
        <p className="text-white/80 text-lg md:text-xl max-w-xl mx-auto mb-8">
          Rate and review ranch dressing at restaurants everywhere
        </p>

        <form onSubmit={handleHeroSearch} className="max-w-2xl mx-auto px-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by restaurant name or location..."
              value={heroSearch}
              onChange={(e) => setHeroSearch(e.target.value)}
              className="w-full px-6 py-4 rounded-full text-dark text-lg shadow-lg focus:outline-none focus:ring-4 focus:ring-white/30 border-0"
            />
            <button
              type="submit"
              className="absolute right-2 top-2 bg-brand hover:bg-brand-dark text-white px-6 py-2 rounded-full font-bold transition-colors border-0 cursor-pointer text-base"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Filter Bar */}
        <section className="mb-8">
          <div className="bg-gray-bg rounded-lg p-4 border border-gray-border">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <input
                type="text"
                placeholder="Filter restaurants..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-4 py-2.5 border border-gray-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand text-dark"
              />
              <select
                value={cuisineFilter}
                onChange={(e) => setCuisineFilter(e.target.value)}
                className="px-4 py-2.5 border border-gray-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand text-dark"
              >
                <option value="">All Cuisines</option>
                {cuisines.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select
                value={brandFilter}
                onChange={(e) => setBrandFilter(e.target.value)}
                className="px-4 py-2.5 border border-gray-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand text-dark"
              >
                <option value="">All Ranch Types</option>
                {brands.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="px-4 py-2.5 border border-gray-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand text-dark"
              >
                <option value="rating">Top Rated</option>
                <option value="reviews">Most Reviews</option>
                <option value="recent">Newest</option>
              </select>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Restaurant List */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-extrabold text-dark">
                {search ? `Results for "${search}"` : 'All Restaurants'}
              </h2>
              <span className="text-sm text-gray-text">{restaurants.length} result{restaurants.length !== 1 ? 's' : ''}</span>
            </div>

            {loading ? (
              <div className="text-center py-16 text-gray-text">
                <div className="w-8 h-8 border-3 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p>Loading restaurants...</p>
              </div>
            ) : restaurants.length === 0 ? (
              <div className="text-center py-16 text-gray-text bg-gray-bg rounded-lg">
                <p className="text-lg font-semibold">No restaurants found</p>
                <p className="text-sm mt-1">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="space-y-3">
                {restaurants.map(r => (
                  <RestaurantCard key={r.id} restaurant={r} />
                ))}
              </div>
            )}
          </div>

          {/* Recent Reviews Sidebar */}
          <div>
            <h2 className="font-display text-xl font-extrabold text-dark mb-4">Recent Reviews</h2>
            <div className="bg-white rounded-lg border border-gray-border overflow-hidden">
              {recentReviews.map(rv => (
                <div key={rv.id} className="px-4">
                  <ReviewCard review={rv} showRestaurant />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
