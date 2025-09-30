const sqlite3 = require('sqlite3').verbose();
const DATASOURCE = './colleges.db';

const db = new sqlite3.Database(DATASOURCE, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
    initializeDatabase();
  }
});

function initializeDatabase() {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS colleges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      location TEXT NOT NULL,
      course TEXT NOT NULL,
      fee INTEGER NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      college_name TEXT NOT NULL,
      rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
      comment TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      college_id INTEGER NOT NULL
    )`, seedData);
  });
}

function seedData() {
  const seedColleges = [
    { name: 'ABC Engineering College', location: 'Hyderabad', course: 'Computer Science', fee: 120000 },
    { name: 'XYZ Institute of Technology', location: 'Bangalore', course: 'Electronics', fee: 100000 },
    { name: 'Sunrise Business School', location: 'Chennai', course: 'MBA', fee: 150000 },
    { name: 'Greenfield Medical College', location: 'Hyderabad', course: 'MBBS', fee: 250000 },
    { name: 'Tech University', location: 'Bangalore', course: 'Computer Science', fee: 180000 },
    { name: 'City Engineering College', location: 'Chennai', course: 'Electronics', fee: 90000 },
    { name: 'National Law School', location: 'Bangalore', course: 'Law', fee: 200000 },
    { name: 'Arts and Science College', location: 'Chennai', course: 'BSc Physics', fee: 80000 }
  ];

  db.get("SELECT COUNT(*) as count FROM colleges", (err, row) => {
    if (err) {
      console.error('Error checking college count:', err.message);
      return;
    }

    if (row.count === 0) {
      console.log('Seeding initial data...');
      const stmt = db.prepare("INSERT INTO colleges (name, location, course, fee) VALUES (?, ?, ?, ?)");

      seedColleges.forEach(college => {
        stmt.run([college.name, college.location, college.course, college.fee]);
      });

      stmt.finalize(() => {
        console.log('Seed data inserted successfully');
        const sampleReviews = [
          { college_name: 'ABC Engineering College', rating: 5, comment: 'Excellent faculty and infrastructure!' },
          { college_name: 'XYZ Institute of Technology', rating: 4, comment: 'Good placements and campus life.' },
          { college_name: 'Sunrise Business School', rating: 5, comment: 'Outstanding management program.' }
        ];

        const reviewStmt = db.prepare("INSERT INTO reviews (college_name, rating, comment) VALUES (?, ?, ?)");
        sampleReviews.forEach(review => {
          reviewStmt.run([review.college_name, review.rating, review.comment]);
        });
        reviewStmt.finalize();
        console.log('Sample reviews added');
      });
    } else {
      console.log('Database already contains data.');
    }
  });
}

module.exports = db;
