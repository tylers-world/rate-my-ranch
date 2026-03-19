const express = require('express');
const router = express.Router();
const db = require('../db/schema');

// GET top 10 (Ranch Hall of Fame)
router.get('/top', (req, res) => {
  const top = db.prepare(`
    SELECT r.*,
      COUNT(rv.id) as review_count,
      ROUND(AVG(rv.overall_score), 1) as avg_overall,
      ROUND(AVG(rv.flavor_score), 1) as avg_flavor,
      ROUND(AVG(rv.thickness_score), 1) as avg_thickness,
      ROUND(AVG(rv.chill_score), 1) as avg_chill,
      ROUND(AVG(rv.dipability_score), 1) as avg_dipability
    FROM restaurants r
    JOIN reviews rv ON r.id = rv.restaurant_id
    GROUP BY r.id
    HAVING review_count >= 1
    ORDER BY avg_overall DESC, review_count DESC
    LIMIT 10
  `).all();

  res.json(top);
});

// GET bottom 10 (The Watery Abyss)
router.get('/bottom', (req, res) => {
  const bottom = db.prepare(`
    SELECT r.*,
      COUNT(rv.id) as review_count,
      ROUND(AVG(rv.overall_score), 1) as avg_overall,
      ROUND(AVG(rv.flavor_score), 1) as avg_flavor,
      ROUND(AVG(rv.thickness_score), 1) as avg_thickness,
      ROUND(AVG(rv.chill_score), 1) as avg_chill,
      ROUND(AVG(rv.dipability_score), 1) as avg_dipability
    FROM restaurants r
    JOIN reviews rv ON r.id = rv.restaurant_id
    GROUP BY r.id
    HAVING review_count >= 1
    ORDER BY avg_overall ASC, review_count DESC
    LIMIT 10
  `).all();

  res.json(bottom);
});

module.exports = router;
