/**
 * Database Initialization and Query Utilities
 * SQLite database management for MovieGo
 */

import * as SQLite from 'expo-sqlite';
import { CREATE_TABLES, DATABASE_NAME, SAMPLE_DATA } from './schema';

let db = null;

/**
 * Initialize database connection
 */
export const initDatabase = async () => {
  try {
    db = await SQLite.openDatabaseAsync(DATABASE_NAME);
    console.log('Database opened successfully');
    await createTables();
    await seedInitialData();
    return db;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

/**
 * Create all tables
 */
const createTables = async () => {
  try {
    for (const [tableName, createSQL] of Object.entries(CREATE_TABLES)) {
      await db.execAsync(createSQL);
      console.log(`Table ${tableName} created successfully`);
    }
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
};

/**
 * Seed initial data (movies and showtimes)
 */
const seedInitialData = async () => {
  try {
    // Check if movies already exist
    const result = await db.getFirstAsync('SELECT COUNT(*) as count FROM movies');
    
    if (result.count === 0) {
      console.log('Seeding initial data...');
      
      // Insert sample movies
      for (const movie of SAMPLE_DATA.movies) {
        await db.runAsync(
          `INSERT INTO movies (title, genre, duration, rating, synopsis, poster_url, release_date, language, director, cast) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [movie.title, movie.genre, movie.duration, movie.rating, movie.synopsis, 
           movie.poster_url, movie.release_date, movie.language, movie.director, movie.cast]
        );
      }
      
      // Generate showtimes for next 7 days
      await generateShowtimes();
      
      console.log('Initial data seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

/**
 * Generate showtimes for all movies
 */
const generateShowtimes = async () => {
  const times = ['10:00', '13:00', '16:00', '19:00', '22:00'];
  const today = new Date();
  
  // Get all movies
  const movies = await db.getAllAsync('SELECT id FROM movies');
  
  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const date = new Date(today);
    date.setDate(date.getDate() + dayOffset);
    const dateStr = date.toISOString().split('T')[0];
    
    for (const movie of movies) {
      for (const time of times) {
        const screenNumber = Math.floor(Math.random() * 5) + 1;
        const price = 10 + Math.floor(Math.random() * 5);
        
        const result = await db.runAsync(
          `INSERT INTO showtimes (movie_id, show_date, show_time, screen_number, available_seats, price) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [movie.id, dateStr, time, screenNumber, 50, price]
        );
        
        // Generate seats for this showtime
        await generateSeats(result.lastInsertRowId);
      }
    }
  }
};

/**
 * Generate seats for a showtime
 */
const generateSeats = async (showtimeId) => {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const seatsPerRow = 10;
  
  for (const row of rows) {
    for (let seatNum = 1; seatNum <= seatsPerRow; seatNum++) {
      await db.runAsync(
        `INSERT INTO seats (showtime_id, seat_row, seat_number, is_available) 
         VALUES (?, ?, ?, 1)`,
        [showtimeId, row, seatNum]
      );
    }
  }
};

/**
 * Get database instance
 */
export const getDatabase = () => {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
};

// ============ USER QUERIES ============

export const userQueries = {
  /**
   * Create a new user
   */
  createUser: async (email, hashedPassword, fullName) => {
    const db = getDatabase();
    const result = await db.runAsync(
      'INSERT INTO users (email, password, full_name) VALUES (?, ?, ?)',
      [email, hashedPassword, fullName]
    );
    return result.lastInsertRowId;
  },

  /**
   * Get user by email
   */
  getUserByEmail: async (email) => {
    const db = getDatabase();
    return await db.getFirstAsync('SELECT * FROM users WHERE email = ?', [email]);
  },

  /**
   * Get user by ID
   */
  getUserById: async (userId) => {
    const db = getDatabase();
    return await db.getFirstAsync('SELECT * FROM users WHERE id = ?', [userId]);
  },

  /**
   * Update user profile
   */
  updateUser: async (userId, fullName, phone, address) => {
    const db = getDatabase();
    await db.runAsync(
      'UPDATE users SET full_name = ?, phone = ?, address = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [fullName, phone, address, userId]
    );
  },

  /**
   * Update user password
   */
  updatePassword: async (userId, hashedPassword) => {
    const db = getDatabase();
    await db.runAsync(
      'UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [hashedPassword, userId]
    );
  }
};

// ============ MOVIE QUERIES ============

export const movieQueries = {
  /**
   * Get all active movies
   */
  getAllMovies: async () => {
    const db = getDatabase();
    return await db.getAllAsync('SELECT * FROM movies WHERE is_active = 1 ORDER BY rating DESC');
  },

  /**
   * Search movies by title or genre
   */
  searchMovies: async (searchTerm) => {
    const db = getDatabase();
    return await db.getAllAsync(
      'SELECT * FROM movies WHERE is_active = 1 AND (title LIKE ? OR genre LIKE ?) ORDER BY rating DESC',
      [`%${searchTerm}%`, `%${searchTerm}%`]
    );
  },

  /**
   * Get movie by ID
   */
  getMovieById: async (movieId) => {
    const db = getDatabase();
    return await db.getFirstAsync('SELECT * FROM movies WHERE id = ?', [movieId]);
  },

  /**
   * Filter movies by genre
   */
  filterByGenre: async (genre) => {
    const db = getDatabase();
    return await db.getAllAsync(
      'SELECT * FROM movies WHERE is_active = 1 AND genre LIKE ? ORDER BY rating DESC',
      [`%${genre}%`]
    );
  }
};

// ============ SHOWTIME QUERIES ============

export const showtimeQueries = {
  /**
   * Get showtimes for a movie
   */
  getShowtimesByMovie: async (movieId) => {
    const db = getDatabase();
    return await db.getAllAsync(
      `SELECT * FROM showtimes 
       WHERE movie_id = ? AND is_active = 1 AND show_date >= date('now')
       ORDER BY show_date, show_time`,
      [movieId]
    );
  },

  /**
   * Get showtime by ID
   */
  getShowtimeById: async (showtimeId) => {
    const db = getDatabase();
    return await db.getFirstAsync('SELECT * FROM showtimes WHERE id = ?', [showtimeId]);
  },

  /**
   * Get available dates for a movie
   */
  getAvailableDates: async (movieId) => {
    const db = getDatabase();
    return await db.getAllAsync(
      `SELECT DISTINCT show_date FROM showtimes 
       WHERE movie_id = ? AND is_active = 1 AND show_date >= date('now')
       ORDER BY show_date`,
      [movieId]
    );
  },

  /**
   * Get showtimes by movie and date
   */
  getShowtimesByMovieAndDate: async (movieId, date) => {
    const db = getDatabase();
    return await db.getAllAsync(
      `SELECT * FROM showtimes 
       WHERE movie_id = ? AND show_date = ? AND is_active = 1
       ORDER BY show_time`,
      [movieId, date]
    );
  }
};

// ============ SEAT QUERIES ============

export const seatQueries = {
  /**
   * Get all seats for a showtime
   */
  getSeatsByShowtime: async (showtimeId) => {
    const db = getDatabase();
    return await db.getAllAsync(
      'SELECT * FROM seats WHERE showtime_id = ? ORDER BY seat_row, seat_number',
      [showtimeId]
    );
  },

  /**
   * Hold seats temporarily
   */
  holdSeats: async (seatIds) => {
    const db = getDatabase();
    const placeholders = seatIds.map(() => '?').join(',');
    await db.runAsync(
      `UPDATE seats SET is_available = 0 WHERE id IN (${placeholders})`,
      seatIds
    );
  },

  /**
   * Release seats
   */
  releaseSeats: async (seatIds) => {
    const db = getDatabase();
    const placeholders = seatIds.map(() => '?').join(',');
    await db.runAsync(
      `UPDATE seats SET is_available = 1 WHERE id IN (${placeholders})`,
      seatIds
    );
  }
};

// ============ BOOKING QUERIES ============

export const bookingQueries = {
  /**
   * Create a new booking
   */
  createBooking: async (userId, movieId, showtimeId, totalSeats, totalAmount, seatIds) => {
    const db = getDatabase();
    
    // Generate booking reference
    const bookingRef = `BK${Date.now()}${Math.floor(Math.random() * 1000)}`;
    
    // Create booking
    const result = await db.runAsync(
      `INSERT INTO bookings (user_id, movie_id, showtime_id, total_seats, total_amount, booking_reference, status, payment_status) 
       VALUES (?, ?, ?, ?, ?, ?, 'confirmed', 'pending')`,
      [userId, movieId, showtimeId, totalSeats, totalAmount, bookingRef]
    );
    
    const bookingId = result.lastInsertRowId;
    
    // Link seats to booking
    for (const seatId of seatIds) {
      await db.runAsync(
        'INSERT INTO booking_seats (booking_id, seat_id) VALUES (?, ?)',
        [bookingId, seatId]
      );
    }
    
    // Mark seats as unavailable
    await seatQueries.holdSeats(seatIds);
    
    // Update available seats count
    await db.runAsync(
      'UPDATE showtimes SET available_seats = available_seats - ? WHERE id = ?',
      [totalSeats, showtimeId]
    );
    
    return { bookingId, bookingRef };
  },

  /**
   * Get booking by ID
   */
  getBookingById: async (bookingId) => {
    const db = getDatabase();
    return await db.getFirstAsync(
      `SELECT b.*, m.title as movie_title, m.poster_url, 
              s.show_date, s.show_time, s.screen_number
       FROM bookings b
       JOIN movies m ON b.movie_id = m.id
       JOIN showtimes s ON b.showtime_id = s.id
       WHERE b.id = ?`,
      [bookingId]
    );
  },

  /**
   * Get user's booking history
   */
  getUserBookings: async (userId) => {
    const db = getDatabase();
    return await db.getAllAsync(
      `SELECT b.*, m.title as movie_title, m.poster_url, m.genre,
              s.show_date, s.show_time, s.screen_number
       FROM bookings b
       JOIN movies m ON b.movie_id = m.id
       JOIN showtimes s ON b.showtime_id = s.id
       WHERE b.user_id = ?
       ORDER BY b.booking_date DESC`,
      [userId]
    );
  },

  /**
   * Get seats for a booking
   */
  getBookingSeats: async (bookingId) => {
    const db = getDatabase();
    return await db.getAllAsync(
      `SELECT s.* FROM seats s
       JOIN booking_seats bs ON s.id = bs.seat_id
       WHERE bs.booking_id = ?
       ORDER BY s.seat_row, s.seat_number`,
      [bookingId]
    );
  },

  /**
   * Update booking payment status
   */
  updatePaymentStatus: async (bookingId, status) => {
    const db = getDatabase();
    await db.runAsync(
      'UPDATE bookings SET payment_status = ? WHERE id = ?',
      [status, bookingId]
    );
  }
};

// ============ PAYMENT QUERIES ============

export const paymentQueries = {
  /**
   * Create a payment record
   */
  createPayment: async (bookingId, amount, paymentMethod) => {
    const db = getDatabase();
    const transactionId = `TXN${Date.now()}${Math.floor(Math.random() * 10000)}`;
    
    const result = await db.runAsync(
      `INSERT INTO payments (booking_id, amount, payment_method, transaction_id, status) 
       VALUES (?, ?, ?, ?, 'completed')`,
      [bookingId, amount, paymentMethod, transactionId]
    );
    
    // Update booking payment status
    await bookingQueries.updatePaymentStatus(bookingId, 'completed');
    
    return { paymentId: result.lastInsertRowId, transactionId };
  },

  /**
   * Get payment by booking ID
   */
  getPaymentByBooking: async (bookingId) => {
    const db = getDatabase();
    return await db.getFirstAsync(
      'SELECT * FROM payments WHERE booking_id = ?',
      [bookingId]
    );
  }
};
