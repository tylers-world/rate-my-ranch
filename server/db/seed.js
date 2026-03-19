const db = require('./schema');

// Clear existing data
db.exec('DELETE FROM reviews');
db.exec('DELETE FROM restaurants');
db.exec("DELETE FROM sqlite_sequence WHERE name='restaurants' OR name='reviews'");

const restaurants = [
  { name: "Big Buck's BBQ", location: "Austin, TX", cuisine_type: "BBQ", photo_url: null, ranch_brand: "House-made Buttermilk", serving_style: "cup", ranch_temperature: "cold" },
  { name: "Sunset Grill", location: "Nashville, TN", cuisine_type: "American", photo_url: null, ranch_brand: "Hidden Valley", serving_style: "bottle on table", ranch_temperature: "room temp" },
  { name: "The Wing Shack", location: "Denver, CO", cuisine_type: "Wings", photo_url: null, ranch_brand: "Ken's Steakhouse", serving_style: "cup", ranch_temperature: "cold" },
  { name: "Pizza Palace", location: "Chicago, IL", cuisine_type: "Pizza", photo_url: null, ranch_brand: "House-made Garlic Ranch", serving_style: "drizzle", ranch_temperature: "cold" },
  { name: "Frontier Saloon", location: "Phoenix, AZ", cuisine_type: "Southwestern", photo_url: null, ranch_brand: "Homestyle Buttermilk", serving_style: "cup", ranch_temperature: "cold" },
  { name: "Cluckin' Good", location: "Dallas, TX", cuisine_type: "Chicken", photo_url: null, ranch_brand: "Wish-Bone", serving_style: "bottle on table", ranch_temperature: "room temp" },
  { name: "Saddle Up Diner", location: "Boise, ID", cuisine_type: "Diner", photo_url: null, ranch_brand: "House-made Dill Ranch", serving_style: "cup", ranch_temperature: "cold" },
  { name: "The Rusty Spur", location: "Tulsa, OK", cuisine_type: "American", photo_url: null, ranch_brand: "Kraft", serving_style: "drizzle", ranch_temperature: "room temp" },
  { name: "Golden Corral Express", location: "Memphis, TN", cuisine_type: "Buffet", photo_url: null, ranch_brand: "Generic Store Brand", serving_style: "bottle on table", ranch_temperature: "room temp" },
  { name: "Trailblazer Tavern", location: "Portland, OR", cuisine_type: "Gastropub", photo_url: null, ranch_brand: "House-made Avocado Ranch", serving_style: "cup", ranch_temperature: "cold" },
  { name: "Lone Star Wings", location: "Houston, TX", cuisine_type: "Wings", photo_url: null, ranch_brand: "Hidden Valley", serving_style: "cup", ranch_temperature: "cold" },
  { name: "Mountain View Cafe", location: "Salt Lake City, UT", cuisine_type: "American", photo_url: null, ranch_brand: "Litehouse", serving_style: "cup", ranch_temperature: "cold" },
];

const insertRestaurant = db.prepare(`
  INSERT INTO restaurants (name, location, cuisine_type, photo_url, ranch_brand, serving_style, ranch_temperature)
  VALUES (@name, @location, @cuisine_type, @photo_url, @ranch_brand, @serving_style, @ranch_temperature)
`);

const insertReview = db.prepare(`
  INSERT INTO reviews (restaurant_id, reviewer_name, overall_score, flavor_score, thickness_score, chill_score, dipability_score, review_text, upvotes, downvotes)
  VALUES (@restaurant_id, @reviewer_name, @overall_score, @flavor_score, @thickness_score, @chill_score, @dipability_score, @review_text, @upvotes, @downvotes)
`);

const reviewData = [
  // Big Buck's BBQ
  { reviewer_name: "RanchLover99", overall: 5, flavor: 5, thickness: 5, chill: 5, dip: 5, text: "Best house-made ranch I've ever had. Creamy, tangy, and ice cold. Pairs perfectly with their brisket fries.", upvotes: 24, downvotes: 1 },
  { reviewer_name: "SauceBoss", overall: 5, flavor: 5, thickness: 4, chill: 5, dip: 5, text: "This ranch is LEGIT. You can tell they make it fresh daily. Thick enough to cling to a wing but smooth enough to drizzle.", upvotes: 18, downvotes: 0 },
  { reviewer_name: "DipQueen", overall: 4, flavor: 5, thickness: 4, chill: 4, dip: 4, text: "Incredible flavor with hints of buttermilk and herbs. Could be slightly thicker for optimal dipping.", upvotes: 11, downvotes: 2 },

  // Sunset Grill
  { reviewer_name: "HonestEater", overall: 2, flavor: 2, thickness: 2, chill: 1, dip: 2, text: "Room temperature Hidden Valley from a bottle? Come on, Sunset Grill. We expected better.", upvotes: 15, downvotes: 3 },
  { reviewer_name: "RanchSkeptic", overall: 2, flavor: 3, thickness: 2, chill: 1, dip: 2, text: "Warm ranch is a crime. The bottle was sitting in the sun on the table. Unacceptable.", upvotes: 22, downvotes: 1 },

  // The Wing Shack
  { reviewer_name: "WingKing", overall: 4, flavor: 4, thickness: 4, chill: 5, dip: 4, text: "Ken's is a solid choice and they keep it COLD. Comes in generous portions too.", upvotes: 9, downvotes: 1 },
  { reviewer_name: "BuffaloGal", overall: 4, flavor: 3, thickness: 4, chill: 5, dip: 5, text: "Perfect consistency for wing dipping. Cold and thick. Wish the flavor had more zing.", upvotes: 7, downvotes: 0 },
  { reviewer_name: "FlavorTown", overall: 3, flavor: 3, thickness: 4, chill: 4, dip: 4, text: "Decent ranch, nothing special. It's Ken's so you know what you're getting.", upvotes: 4, downvotes: 1 },

  // Pizza Palace
  { reviewer_name: "DeepDishDave", overall: 5, flavor: 5, thickness: 5, chill: 4, dip: 5, text: "Their garlic ranch drizzle on pizza is life-changing. I dream about this ranch.", upvotes: 31, downvotes: 2 },
  { reviewer_name: "CheeseWhiz", overall: 5, flavor: 5, thickness: 4, chill: 5, dip: 5, text: "House-made garlic ranch that they drizzle on your slice. It's an experience.", upvotes: 19, downvotes: 0 },
  { reviewer_name: "PizzaPurist", overall: 4, flavor: 4, thickness: 5, chill: 4, dip: 4, text: "As someone who used to think ranch on pizza was sacrilege... I'm converted.", upvotes: 14, downvotes: 3 },

  // Frontier Saloon
  { reviewer_name: "DesertRat", overall: 5, flavor: 5, thickness: 5, chill: 5, dip: 5, text: "The best ranch in Arizona, hands down. Thick, herby, ice-cold perfection.", upvotes: 27, downvotes: 0 },
  { reviewer_name: "CactusJack", overall: 4, flavor: 5, thickness: 4, chill: 5, dip: 4, text: "A ranch oasis in the desert. Their buttermilk recipe is top-notch.", upvotes: 12, downvotes: 1 },

  // Cluckin' Good
  { reviewer_name: "ChickenLittle", overall: 1, flavor: 1, thickness: 1, chill: 1, dip: 1, text: "Wish-Bone ranch at room temp in a squeeze bottle. This is a ranch disaster zone.", upvotes: 33, downvotes: 2 },
  { reviewer_name: "NuggetFan", overall: 2, flavor: 2, thickness: 1, chill: 1, dip: 1, text: "Watery, warm, and flavorless. The chicken deserves better than this.", upvotes: 20, downvotes: 1 },
  { reviewer_name: "DipDisaster", overall: 1, flavor: 1, thickness: 1, chill: 1, dip: 1, text: "I've had better ranch from a gas station. Actually, I HAVE had better ranch from a gas station.", upvotes: 28, downvotes: 0 },

  // Saddle Up Diner
  { reviewer_name: "BreakfastBandit", overall: 5, flavor: 5, thickness: 5, chill: 5, dip: 5, text: "House-made dill ranch is a revelation. They put fresh dill in it and serve it ice cold. 10/10.", upvotes: 16, downvotes: 0 },
  { reviewer_name: "HashBrownHero", overall: 4, flavor: 5, thickness: 4, chill: 4, dip: 4, text: "Dipping hash browns in their dill ranch is a religious experience.", upvotes: 10, downvotes: 1 },

  // The Rusty Spur
  { reviewer_name: "BarFly", overall: 2, flavor: 2, thickness: 3, chill: 2, dip: 3, text: "Kraft ranch drizzled on everything whether you want it or not. Meh.", upvotes: 5, downvotes: 2 },
  { reviewer_name: "PubCrawler", overall: 3, flavor: 3, thickness: 3, chill: 2, dip: 3, text: "Standard Kraft. Not offensive but not exciting. At least it's thick enough.", upvotes: 3, downvotes: 1 },

  // Golden Corral Express
  { reviewer_name: "BuffetBuster", overall: 1, flavor: 1, thickness: 1, chill: 1, dip: 1, text: "Generic store brand ranch that's been sitting out on the buffet for who knows how long. Warm ranch soup.", upvotes: 25, downvotes: 0 },
  { reviewer_name: "AllYouCanEat", overall: 2, flavor: 2, thickness: 1, chill: 1, dip: 1, text: "It's technically ranch, I guess. Barely.", upvotes: 14, downvotes: 2 },

  // Trailblazer Tavern
  { reviewer_name: "FoodiePortland", overall: 5, flavor: 5, thickness: 5, chill: 5, dip: 5, text: "Avocado ranch?! GENIUS. Creamy, green, cold, and absolutely addicting. This is the future.", upvotes: 38, downvotes: 1 },
  { reviewer_name: "HopHead", overall: 5, flavor: 5, thickness: 4, chill: 5, dip: 5, text: "Leave it to Portland to reinvent ranch. The avocado version is incredible.", upvotes: 22, downvotes: 0 },
  { reviewer_name: "TacoTuesday", overall: 4, flavor: 4, thickness: 5, chill: 4, dip: 4, text: "Unique and delicious. The avocado adds such a nice creaminess.", upvotes: 11, downvotes: 2 },

  // Lone Star Wings
  { reviewer_name: "TexasToast", overall: 4, flavor: 4, thickness: 4, chill: 5, dip: 4, text: "Hidden Valley served properly — cold, in a cup, generous portions. Respect.", upvotes: 8, downvotes: 1 },
  { reviewer_name: "HotSauceHank", overall: 3, flavor: 3, thickness: 3, chill: 4, dip: 3, text: "It's Hidden Valley. Nothing special but at least it's cold.", upvotes: 4, downvotes: 0 },

  // Mountain View Cafe
  { reviewer_name: "SkiBum", overall: 4, flavor: 4, thickness: 5, chill: 4, dip: 5, text: "Litehouse is an underrated ranch brand and Mountain View serves it perfectly.", upvotes: 9, downvotes: 0 },
  { reviewer_name: "TrailMixer", overall: 4, flavor: 4, thickness: 4, chill: 4, dip: 4, text: "Solid ranch game. Litehouse is always reliable and they keep it fresh.", upvotes: 6, downvotes: 1 },
];

// Map reviews to restaurants (by index order above)
const reviewAssignments = [
  [0, 1, 2],       // Big Buck's BBQ (indices into reviewData)
  [3, 4],           // Sunset Grill
  [5, 6, 7],        // The Wing Shack
  [8, 9, 10],       // Pizza Palace
  [11, 12],         // Frontier Saloon
  [13, 14, 15],     // Cluckin' Good
  [16, 17],         // Saddle Up Diner
  [18, 19],         // The Rusty Spur
  [20, 21],         // Golden Corral Express
  [22, 23, 24],     // Trailblazer Tavern
  [25, 26],         // Lone Star Wings
  [27, 28],         // Mountain View Cafe
];

const insertAll = db.transaction(() => {
  const restaurantIds = [];
  for (const r of restaurants) {
    const result = insertRestaurant.run(r);
    restaurantIds.push(result.lastInsertRowid);
  }

  reviewAssignments.forEach((indices, restaurantIndex) => {
    indices.forEach(reviewIndex => {
      const r = reviewData[reviewIndex];
      insertReview.run({
        restaurant_id: restaurantIds[restaurantIndex],
        reviewer_name: r.reviewer_name,
        overall_score: r.overall,
        flavor_score: r.flavor,
        thickness_score: r.thickness,
        chill_score: r.chill,
        dipability_score: r.dip,
        review_text: r.text,
        upvotes: r.upvotes,
        downvotes: r.downvotes,
      });
    });
  });
});

insertAll();

console.log(`Seeded ${restaurants.length} restaurants and ${reviewData.length} reviews.`);
process.exit(0);
