const express = require('express');
const router = express.Router();
const db = require('../db/schema');
const upload = require('../middleware/upload');

// GET all restaurants with average ratings
router.get('/', (req, res) => {
  const { search, cuisine, ranch_brand, sort } = req.query;

  let query = `
    SELECT r.*,
      COUNT(rv.id) as review_count,
      ROUND(AVG(rv.overall_score), 1) as avg_overall,
      ROUND(AVG(rv.flavor_score), 1) as avg_flavor,
      ROUND(AVG(rv.thickness_score), 1) as avg_thickness,
      ROUND(AVG(rv.chill_score), 1) as avg_chill,
      ROUND(AVG(rv.dipability_score), 1) as avg_dipability
    FROM restaurants r
    LEFT JOIN reviews rv ON r.id = rv.restaurant_id
  `;

  const conditions = [];
  const params = [];

  if (search) {
    conditions.push('(r.name LIKE ? OR r.location LIKE ?)');
    params.push(`%${search}%`, `%${search}%`);
  }
  if (cuisine) {
    conditions.push('r.cuisine_type = ?');
    params.push(cuisine);
  }
  if (ranch_brand) {
    conditions.push('r.ranch_brand LIKE ?');
    params.push(`%${ranch_brand}%`);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' GROUP BY r.id';

  if (sort === 'rating') {
    query += ' ORDER BY avg_overall DESC NULLS LAST';
  } else if (sort === 'reviews') {
    query += ' ORDER BY review_count DESC';
  } else {
    query += ' ORDER BY r.created_at DESC';
  }

  const restaurants = db.prepare(query).all(...params);
  res.json(restaurants);
});

// GET cuisine types for filter (must be before /:id)
router.get('/meta/cuisines', (req, res) => {
  const cuisines = db.prepare('SELECT DISTINCT cuisine_type FROM restaurants ORDER BY cuisine_type').all();
  res.json(cuisines.map(c => c.cuisine_type));
});

// GET ranch brands for filter (must be before /:id)
router.get('/meta/brands', (req, res) => {
  const brands = db.prepare('SELECT DISTINCT ranch_brand FROM restaurants ORDER BY ranch_brand').all();
  res.json(brands.map(b => b.ranch_brand));
});

// GET single restaurant with full details
router.get('/:id', (req, res) => {
  const restaurant = db.prepare(`
    SELECT r.*,
      COUNT(rv.id) as review_count,
      ROUND(AVG(rv.overall_score), 1) as avg_overall,
      ROUND(AVG(rv.flavor_score), 1) as avg_flavor,
      ROUND(AVG(rv.thickness_score), 1) as avg_thickness,
      ROUND(AVG(rv.chill_score), 1) as avg_chill,
      ROUND(AVG(rv.dipability_score), 1) as avg_dipability
    FROM restaurants r
    LEFT JOIN reviews rv ON r.id = rv.restaurant_id
    WHERE r.id = ?
    GROUP BY r.id
  `).get(req.params.id);

  if (!restaurant) {
    return res.status(404).json({ error: 'Restaurant not found' });
  }

  res.json(restaurant);
});

// POST new restaurant
router.post('/', upload.single('photo'), (req, res) => {
  const { name, location, cuisine_type, ranch_brand, serving_style, ranch_temperature } = req.body;

  if (!name || !location || !cuisine_type) {
    return res.status(400).json({ error: 'Name, location, and cuisine type are required' });
  }

  const photo_url = req.file ? `/uploads/${req.file.filename}` : null;

  const result = db.prepare(`
    INSERT INTO restaurants (name, location, cuisine_type, photo_url, ranch_brand, serving_style, ranch_temperature)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(name, location, cuisine_type, photo_url, ranch_brand || 'Unknown', serving_style || 'cup', ranch_temperature || 'cold');

  const restaurant = db.prepare('SELECT * FROM restaurants WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(restaurant);
});

module.exports = router;
