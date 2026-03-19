const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, 'ranch.db');

function initializeDatabase() {
  const db = new Database(DB_PATH);

  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  db.exec(`
    CREATE TABLE IF NOT EXISTS restaurants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      location TEXT NOT NULL,
      cuisine_type TEXT NOT NULL,
      photo_url TEXT,
      ranch_brand TEXT NOT NULL DEFAULT 'Unknown',
      serving_style TEXT NOT NULL DEFAULT 'cup',
      ranch_temperature TEXT NOT NULL DEFAULT 'cold',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      restaurant_id INTEGER NOT NULL,
      reviewer_name TEXT NOT NULL DEFAULT 'Anonymous',
      overall_score INTEGER NOT NULL CHECK(overall_score BETWEEN 1 AND 5),
      flavor_score INTEGER NOT NULL CHECK(flavor_score BETWEEN 1 AND 5),
      thickness_score INTEGER NOT NULL CHECK(thickness_score BETWEEN 1 AND 5),
      chill_score INTEGER NOT NULL CHECK(chill_score BETWEEN 1 AND 5),
      dipability_score INTEGER NOT NULL CHECK(dipability_score BETWEEN 1 AND 5),
      review_text TEXT,
      photo_url TEXT,
      upvotes INTEGER DEFAULT 0,
      downvotes INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_reviews_restaurant ON reviews(restaurant_id);
    CREATE INDEX IF NOT EXISTS idx_reviews_overall ON reviews(overall_score);
  `);

  return db;
}

const db = initializeDatabase();

module.exports = db;
