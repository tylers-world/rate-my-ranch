const express = require('express');
const router = express.Router();
const db = require('../db/schema');
const upload = require('../middleware/upload');

// GET reviews for a restaurant
router.get('/restaurant/:restaurantId', (req, res) => {
  const reviews = db.prepare(`
    SELECT * FROM reviews
    WHERE restaurant_id = ?
    ORDER BY created_at DESC
  `).all(req.params.restaurantId);

  res.json(reviews);
});

// GET recent reviews (for homepage)
router.get('/recent', (req, res) => {
  const limit = parseInt(req.query.limit) || 5;
  const reviews = db.prepare(`
    SELECT rv.*, r.name as restaurant_name, r.id as restaurant_id
    FROM reviews rv
    JOIN restaurants r ON rv.restaurant_id = r.id
    ORDER BY rv.created_at DESC
    LIMIT ?
  `).all(limit);

  res.json(reviews);
});

// POST new review
router.post('/', upload.single('photo'), (req, res) => {
  const {
    restaurant_id, reviewer_name,
    overall_score, flavor_score, thickness_score, chill_score, dipability_score,
    review_text
  } = req.body;

  if (!restaurant_id || !overall_score) {
    return res.status(400).json({ error: 'Restaurant ID and overall score are required' });
  }

  const restaurant = db.prepare('SELECT id FROM restaurants WHERE id = ?').get(restaurant_id);
  if (!restaurant) {
    return res.status(404).json({ error: 'Restaurant not found' });
  }

  const photo_url = req.file ? `/uploads/${req.file.filename}` : null;

  const result = db.prepare(`
    INSERT INTO reviews (restaurant_id, reviewer_name, overall_score, flavor_score, thickness_score, chill_score, dipability_score, review_text, photo_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    restaurant_id,
    reviewer_name || 'Anonymous',
    parseInt(overall_score),
    parseInt(flavor_score) || parseInt(overall_score),
    parseInt(thickness_score) || parseInt(overall_score),
    parseInt(chill_score) || parseInt(overall_score),
    parseInt(dipability_score) || parseInt(overall_score),
    review_text || null,
    photo_url
  );

  const review = db.prepare('SELECT * FROM reviews WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(review);
});

// POST upvote
router.post('/:id/upvote', (req, res) => {
  db.prepare('UPDATE reviews SET upvotes = upvotes + 1 WHERE id = ?').run(req.params.id);
  const review = db.prepare('SELECT * FROM reviews WHERE id = ?').get(req.params.id);
  if (!review) return res.status(404).json({ error: 'Review not found' });
  res.json(review);
});

// POST downvote
router.post('/:id/downvote', (req, res) => {
  db.prepare('UPDATE reviews SET downvotes = downvotes + 1 WHERE id = ?').run(req.params.id);
  const review = db.prepare('SELECT * FROM reviews WHERE id = ?').get(req.params.id);
  if (!review) return res.status(404).json({ error: 'Review not found' });
  res.json(review);
});

module.exports = router;
