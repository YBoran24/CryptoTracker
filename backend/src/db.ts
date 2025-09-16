import { Database } from 'sqlite3';
import dotenv from 'dotenv';

dotenv.config();

// Create a SQLite database connection
const db = new Database('./cryptotracker.db', (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('Database connected successfully');
  }
});

// Create users table
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
    if (err) {
      console.error('Error creating users table:', err.message);
    } else {
      console.log('Users table created successfully');
    }
  });
  
  // Create favorites table
  db.run(`CREATE TABLE IF NOT EXISTS favorites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    coin_id TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    UNIQUE(user_id, coin_id)
  )`, (err) => {
    if (err) {
      console.error('Error creating favorites table:', err.message);
    } else {
      console.log('Favorites table created successfully');
    }
  });
  
  // Create portfolio table
  db.run(`CREATE TABLE IF NOT EXISTS portfolio (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    coin_id TEXT NOT NULL,
    amount REAL NOT NULL,
    purchase_price REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
  )`, (err) => {
    if (err) {
      console.error('Error creating portfolio table:', err.message);
    } else {
      console.log('Portfolio table created successfully');
    }
  });
  
  // Create indexes for better performance
  db.run(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`, (err) => {
    if (err) {
      console.error('Error creating index on users.email:', err.message);
    }
  });
  
  db.run(`CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id)`, (err) => {
    if (err) {
      console.error('Error creating index on favorites.user_id:', err.message);
    }
  });
  
  db.run(`CREATE INDEX IF NOT EXISTS idx_portfolio_user_id ON portfolio(user_id)`, (err) => {
    if (err) {
      console.error('Error creating index on portfolio.user_id:', err.message);
    }
  });
});

export default db;