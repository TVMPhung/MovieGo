/**
 * Database Schema for MovieGo Application
 * SQLite Database Structure
 */

export const DATABASE_NAME = 'moviego.db';

// SQL statements to create all tables
export const CREATE_TABLES = {
  // Users table for authentication and profile
  users: `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      full_name TEXT NOT NULL,
      phone TEXT,
      address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `,

  // Movies table
  movies: `
    CREATE TABLE IF NOT EXISTS movies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      genre TEXT NOT NULL,
      duration INTEGER NOT NULL,
      rating REAL DEFAULT 0.0,
      synopsis TEXT,
      poster_url TEXT,
      release_date TEXT,
      language TEXT,
      director TEXT,
      cast TEXT,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `,

  // Showtimes table
  showtimes: `
    CREATE TABLE IF NOT EXISTS showtimes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      movie_id INTEGER NOT NULL,
      show_date TEXT NOT NULL,
      show_time TEXT NOT NULL,
      screen_number INTEGER NOT NULL,
      available_seats INTEGER NOT NULL,
      price REAL NOT NULL,
      is_active INTEGER DEFAULT 1,
      FOREIGN KEY (movie_id) REFERENCES movies(id)
    );
  `,

  // Seats table
  seats: `
    CREATE TABLE IF NOT EXISTS seats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      showtime_id INTEGER NOT NULL,
      seat_row TEXT NOT NULL,
      seat_number INTEGER NOT NULL,
      is_available INTEGER DEFAULT 1,
      FOREIGN KEY (showtime_id) REFERENCES showtimes(id),
      UNIQUE(showtime_id, seat_row, seat_number)
    );
  `,

  // Bookings table
  bookings: `
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      movie_id INTEGER NOT NULL,
      showtime_id INTEGER NOT NULL,
      booking_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      total_seats INTEGER NOT NULL,
      total_amount REAL NOT NULL,
      status TEXT DEFAULT 'pending',
      payment_status TEXT DEFAULT 'pending',
      booking_reference TEXT UNIQUE,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (movie_id) REFERENCES movies(id),
      FOREIGN KEY (showtime_id) REFERENCES showtimes(id)
    );
  `,

  // Booking seats (junction table)
  booking_seats: `
    CREATE TABLE IF NOT EXISTS booking_seats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      booking_id INTEGER NOT NULL,
      seat_id INTEGER NOT NULL,
      FOREIGN KEY (booking_id) REFERENCES bookings(id),
      FOREIGN KEY (seat_id) REFERENCES seats(id)
    );
  `,

  // Payments table
  payments: `
    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      booking_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      payment_method TEXT NOT NULL,
      payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      transaction_id TEXT UNIQUE,
      status TEXT DEFAULT 'pending',
      FOREIGN KEY (booking_id) REFERENCES bookings(id)
    );
  `
};

// Sample data for testing
export const SAMPLE_DATA = {
  movies: [
    {
      title: 'Avengers: Endgame',
      genre: 'Action, Sci-Fi',
      duration: 181,
      rating: 8.4,
      synopsis: 'After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more to reverse Thanos\' actions and restore balance to the universe.',
      poster_url: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
      release_date: '2019-04-26',
      language: 'English',
      director: 'Anthony Russo, Joe Russo',
      cast: 'Robert Downey Jr., Chris Evans, Mark Ruffalo'
    },
    {
      title: 'The Shawshank Redemption',
      genre: 'Drama',
      duration: 142,
      rating: 9.3,
      synopsis: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
      poster_url: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
      release_date: '1994-09-23',
      language: 'English',
      director: 'Frank Darabont',
      cast: 'Tim Robbins, Morgan Freeman'
    },
    {
      title: 'Inception',
      genre: 'Action, Sci-Fi, Thriller',
      duration: 148,
      rating: 8.8,
      synopsis: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
      poster_url: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
      release_date: '2010-07-16',
      language: 'English',
      director: 'Christopher Nolan',
      cast: 'Leonardo DiCaprio, Joseph Gordon-Levitt, Ellen Page'
    },
    {
      title: 'The Dark Knight',
      genre: 'Action, Crime, Drama',
      duration: 152,
      rating: 9.0,
      synopsis: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
      poster_url: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
      release_date: '2008-07-18',
      language: 'English',
      director: 'Christopher Nolan',
      cast: 'Christian Bale, Heath Ledger, Aaron Eckhart'
    },
    {
      title: 'Interstellar',
      genre: 'Adventure, Drama, Sci-Fi',
      duration: 169,
      rating: 8.6,
      synopsis: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
      poster_url: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
      release_date: '2014-11-07',
      language: 'English',
      director: 'Christopher Nolan',
      cast: 'Matthew McConaughey, Anne Hathaway, Jessica Chastain'
    }
  ],
  
  showtimes: [
    // Each movie will have multiple showtimes
    // Will be generated programmatically based on movie_id
  ]
};
