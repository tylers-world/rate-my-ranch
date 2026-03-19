const express = require('express');
const router = express.Router();
const db = require('../db/schema');
const { requireAuth, optionalAuth } = require('../middleware/auth');

// GET /api/users/:username — public profile with stats, reviews, achievements
router.get('/:username', optionalAuth, (req, res) => {
  const user = db.prepare('SELECT id, username, email, bio, created_at FROM users WHERE username = ?').get(req.params.username);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Get all reviews by this user with restaurant info
  const reviews = db.prepare(`
    SELECT rv.*, r.name as restaurant_name, r.ranch_brand, r.id as restaurant_id
    FROM reviews rv
    JOIN restaurants r ON rv.restaurant_id = r.id
    WHERE rv.user_id = ?
    ORDER BY rv.created_at DESC
  `).all(user.id);

  // Calculate stats
  const stats = {
    totalReviews: reviews.length,
    restaurantsReviewed: new Set(reviews.map(r => r.restaurant_id)).size,
    avgScore: reviews.length > 0
      ? Number((reviews.reduce((sum, r) => sum + r.overall_score, 0) / reviews.length).toFixed(1))
      : 0,
    helpfulVotes: reviews.reduce((sum, r) => sum + (r.upvotes || 0), 0),
  };

  // Average sub-ratings for personality
  const avgFlavor = reviews.length > 0 ? reviews.reduce((s, r) => s + r.flavor_score, 0) / reviews.length : 0;
  const avgThickness = reviews.length > 0 ? reviews.reduce((s, r) => s + r.thickness_score, 0) / reviews.length : 0;
  const avgChill = reviews.length > 0 ? reviews.reduce((s, r) => s + r.chill_score, 0) / reviews.length : 0;
  const avgDipability = reviews.length > 0 ? reviews.reduce((s, r) => s + r.dipability_score, 0) / reviews.length : 0;

  // Determine personality type
  let personality = null;
  if (reviews.length > 0) {
    const scores = [
      { label: 'Flavor Hound', value: avgFlavor },
      { label: 'Thick & Proud', value: avgThickness },
      { label: 'Ice Cold Judge', value: avgChill },
      { label: 'Dip Devotee', value: avgDipability },
    ];
    const highest = scores.reduce((a, b) => a.value > b.value ? a : b);
    const allClose = scores.every(s => Math.abs(s.value - highest.value) < 0.5);

    if (stats.avgScore < 2.5) {
      personality = { label: 'The Skeptic', color: 'bg-accent-red/10 text-accent-red' };
    } else if (stats.avgScore >= 4.2) {
      personality = { label: 'Ranch Optimist', color: 'bg-score-green/10 text-score-green' };
    } else if (allClose) {
      personality = { label: 'The Purist', color: 'bg-brand-bg text-brand' };
    } else {
      const colorMap = {
        'Flavor Hound': 'bg-score-yellow/10 text-score-yellow',
        'Thick & Proud': 'bg-purple-100 text-purple-700',
        'Ice Cold Judge': 'bg-blue-100 text-blue-700',
        'Dip Devotee': 'bg-orange-100 text-orange-700',
      };
      personality = { label: highest.label, color: colorMap[highest.label] || 'bg-brand-bg text-brand' };
    }
  }

  // Calculate achievements
  const hasPhoto = reviews.some(r => r.photo_url);
  const has10Upvotes = reviews.some(r => r.upvotes >= 10);
  const chill5Count = reviews.filter(r => r.chill_score === 5).length;
  const dip5Count = reviews.filter(r => r.dipability_score === 5).length;
  const has1Star = reviews.some(r => r.overall_score === 1);

  // Check Hall of Fame
  const topRestaurants = db.prepare(`
    SELECT r.id
    FROM restaurants r
    JOIN reviews rv ON r.id = rv.restaurant_id
    GROUP BY r.id
    HAVING COUNT(rv.id) >= 1
    ORDER BY ROUND(AVG(rv.overall_score), 1) DESC
    LIMIT 10
  `).all().map(r => r.id);
  const reviewedHoF = reviews.some(r => topRestaurants.includes(r.restaurant_id));

  const achievements = [
    { id: 'rookie', emoji: '🤠', name: 'Ranch Rookie', desc: 'Leave your first review', earned: reviews.length >= 1 },
    { id: 'connoisseur', emoji: '🏆', name: 'Ranch Connoisseur', desc: 'Review 10 ranches', earned: reviews.length >= 10 },
    { id: 'legend', emoji: '🌟', name: 'Ranch Legend', desc: 'Review 25 ranches', earned: reviews.length >= 25 },
    { id: 'critic', emoji: '💀', name: 'The Critic', desc: 'Give a 1-star rating', earned: has1Star },
    { id: 'chill', emoji: '🧊', name: 'Chill Chaser', desc: 'Rate Chill Factor a 5 on 5 reviews', earned: chill5Count >= 5 },
    { id: 'dip', emoji: '🥣', name: 'Dip Master', desc: 'Rate Dip-ability a 5 on 5 reviews', earned: dip5Count >= 5 },
    { id: 'photo', emoji: '📸', name: 'Photogenic Ranch', desc: 'Upload a photo with a review', earned: hasPhoto },
    { id: 'hottake', emoji: '🔥', name: 'Hot Take', desc: 'Have a review receive 10 helpful votes', earned: has10Upvotes },
    { id: 'hof', emoji: '👑', name: 'Hall of Famer', desc: 'Review a Hall of Fame top 10 restaurant', earned: reviewedHoF },
  ];

  // Favorite ranch (highest rated)
  let favoriteRanch = null;
  if (reviews.length > 0) {
    const best = reviews.reduce((a, b) => a.overall_score > b.overall_score ? a : b);
    favoriteRanch = {
      restaurant_name: best.restaurant_name,
      restaurant_id: best.restaurant_id,
      score: best.overall_score,
      review_text: best.review_text,
      ranch_brand: best.ranch_brand,
    };
  }

  // Is the viewer the profile owner?
  const isOwner = req.user && req.user.id === user.id;

  res.json({
    user,
    stats,
    personality,
    achievements,
    favoriteRanch,
    reviews,
    isOwner,
  });
});

// PUT /api/users/:username/bio — update bio (owner only)
router.put('/:username/bio', requireAuth, (req, res) => {
  const user = db.prepare('SELECT id FROM users WHERE username = ?').get(req.params.username);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (req.user.id !== user.id) {
    return res.status(403).json({ error: 'You can only edit your own profile' });
  }

  const bio = (req.body.bio || '').slice(0, 150);
  db.prepare('UPDATE users SET bio = ? WHERE id = ?').run(bio, user.id);

  res.json({ bio });
});

// DELETE /api/users/reviews/:reviewId — delete own review
router.delete('/reviews/:reviewId', requireAuth, (req, res) => {
  const review = db.prepare('SELECT * FROM reviews WHERE id = ?').get(req.params.reviewId);
  if (!review) {
    return res.status(404).json({ error: 'Review not found' });
  }

  if (review.user_id !== req.user.id) {
    return res.status(403).json({ error: 'You can only delete your own reviews' });
  }

  db.prepare('DELETE FROM reviews WHERE id = ?').run(req.params.reviewId);
  res.json({ success: true });
});

module.exports = router;
