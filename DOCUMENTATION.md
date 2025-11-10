# MovieGo Project Documentation

## Database Schema Documentation

### 1. Users Table
Stores user account information for authentication and profile management.

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,              -- Hashed with bcryptjs
  full_name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Movies Table
Contains movie catalog with comprehensive information.

```sql
CREATE TABLE movies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  genre TEXT NOT NULL,                 -- Comma-separated genres
  duration INTEGER NOT NULL,            -- Duration in minutes
  rating REAL DEFAULT 0.0,             -- Rating out of 10
  synopsis TEXT,
  poster_url TEXT,                     -- Movie poster image URL
  release_date TEXT,
  language TEXT,
  director TEXT,
  cast TEXT,                           -- Comma-separated cast names
  is_active INTEGER DEFAULT 1,         -- 1 = active, 0 = inactive
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Showtimes Table
Manages movie screening schedules.

```sql
CREATE TABLE showtimes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  movie_id INTEGER NOT NULL,
  show_date TEXT NOT NULL,             -- Format: YYYY-MM-DD
  show_time TEXT NOT NULL,             -- Format: HH:MM
  screen_number INTEGER NOT NULL,
  available_seats INTEGER NOT NULL,
  price REAL NOT NULL,
  is_active INTEGER DEFAULT 1,
  FOREIGN KEY (movie_id) REFERENCES movies(id)
);
```

### 4. Seats Table
Tracks individual seat availability for each showtime.

```sql
CREATE TABLE seats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  showtime_id INTEGER NOT NULL,
  seat_row TEXT NOT NULL,              -- A-H
  seat_number INTEGER NOT NULL,        -- 1-10
  is_available INTEGER DEFAULT 1,      -- 1 = available, 0 = booked
  FOREIGN KEY (showtime_id) REFERENCES showtimes(id),
  UNIQUE(showtime_id, seat_row, seat_number)
);
```

### 5. Bookings Table
Records ticket bookings made by users.

```sql
CREATE TABLE bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  movie_id INTEGER NOT NULL,
  showtime_id INTEGER NOT NULL,
  booking_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  total_seats INTEGER NOT NULL,
  total_amount REAL NOT NULL,
  status TEXT DEFAULT 'pending',        -- pending/confirmed/cancelled
  payment_status TEXT DEFAULT 'pending', -- pending/completed/failed
  booking_reference TEXT UNIQUE,        -- Unique booking reference
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (movie_id) REFERENCES movies(id),
  FOREIGN KEY (showtime_id) REFERENCES showtimes(id)
);
```

### 6. Booking Seats Table
Junction table linking bookings to specific seats.

```sql
CREATE TABLE booking_seats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  booking_id INTEGER NOT NULL,
  seat_id INTEGER NOT NULL,
  FOREIGN KEY (booking_id) REFERENCES bookings(id),
  FOREIGN KEY (seat_id) REFERENCES seats(id)
);
```

### 7. Payments Table
Records payment transactions for bookings.

```sql
CREATE TABLE payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  booking_id INTEGER NOT NULL,
  amount REAL NOT NULL,
  payment_method TEXT NOT NULL,        -- card/wallet/upi
  payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  transaction_id TEXT UNIQUE,
  status TEXT DEFAULT 'pending',       -- pending/completed/failed
  FOREIGN KEY (booking_id) REFERENCES bookings(id)
);
```

## API Query Functions Documentation

### User Queries

#### `userQueries.createUser(email, hashedPassword, fullName)`
Creates a new user account.
- **Parameters**: email, hashed password, full name
- **Returns**: User ID
- **Usage**: Sign up process

#### `userQueries.getUserByEmail(email)`
Retrieves user by email address.
- **Parameters**: email
- **Returns**: User object or null
- **Usage**: Login authentication

#### `userQueries.getUserById(userId)`
Retrieves user by ID.
- **Parameters**: userId
- **Returns**: User object
- **Usage**: Profile loading

#### `userQueries.updateUser(userId, fullName, phone, address)`
Updates user profile information.
- **Parameters**: userId, fullName, phone, address
- **Returns**: void
- **Usage**: Profile editing

### Movie Queries

#### `movieQueries.getAllMovies()`
Retrieves all active movies.
- **Returns**: Array of movie objects
- **Usage**: Movies list screen

#### `movieQueries.searchMovies(searchTerm)`
Searches movies by title or genre.
- **Parameters**: searchTerm
- **Returns**: Array of matching movies
- **Usage**: Search functionality

#### `movieQueries.getMovieById(movieId)`
Retrieves movie by ID.
- **Parameters**: movieId
- **Returns**: Movie object
- **Usage**: Movie details screen

#### `movieQueries.filterByGenre(genre)`
Filters movies by genre.
- **Parameters**: genre
- **Returns**: Array of movies
- **Usage**: Genre filter

### Showtime Queries

#### `showtimeQueries.getShowtimesByMovie(movieId)`
Retrieves all showtimes for a movie.
- **Parameters**: movieId
- **Returns**: Array of showtime objects
- **Usage**: Movie details screen

#### `showtimeQueries.getShowtimeById(showtimeId)`
Retrieves showtime by ID.
- **Parameters**: showtimeId
- **Returns**: Showtime object
- **Usage**: Booking screen

#### `showtimeQueries.getAvailableDates(movieId)`
Gets available dates for a movie.
- **Parameters**: movieId
- **Returns**: Array of date objects
- **Usage**: Date selection

#### `showtimeQueries.getShowtimesByMovieAndDate(movieId, date)`
Retrieves showtimes for specific movie and date.
- **Parameters**: movieId, date
- **Returns**: Array of showtime objects
- **Usage**: Showtime selection

### Seat Queries

#### `seatQueries.getSeatsByShowtime(showtimeId)`
Retrieves all seats for a showtime.
- **Parameters**: showtimeId
- **Returns**: Array of seat objects
- **Usage**: Seat selection screen

#### `seatQueries.holdSeats(seatIds)`
Marks seats as unavailable.
- **Parameters**: Array of seat IDs
- **Returns**: void
- **Usage**: After booking confirmation

#### `seatQueries.releaseSeats(seatIds)`
Marks seats as available again.
- **Parameters**: Array of seat IDs
- **Returns**: void
- **Usage**: Booking cancellation

### Booking Queries

#### `bookingQueries.createBooking(userId, movieId, showtimeId, totalSeats, totalAmount, seatIds)`
Creates a new booking with selected seats.
- **Parameters**: userId, movieId, showtimeId, totalSeats, totalAmount, seatIds array
- **Returns**: { bookingId, bookingRef }
- **Usage**: Payment confirmation

#### `bookingQueries.getBookingById(bookingId)`
Retrieves booking with movie and showtime details.
- **Parameters**: bookingId
- **Returns**: Booking object with joined data
- **Usage**: Confirmation screen

#### `bookingQueries.getUserBookings(userId)`
Retrieves all bookings for a user.
- **Parameters**: userId
- **Returns**: Array of booking objects
- **Usage**: Ticket history

#### `bookingQueries.getBookingSeats(bookingId)`
Retrieves seats for a booking.
- **Parameters**: bookingId
- **Returns**: Array of seat objects
- **Usage**: Ticket details

#### `bookingQueries.updatePaymentStatus(bookingId, status)`
Updates payment status of a booking.
- **Parameters**: bookingId, status
- **Returns**: void
- **Usage**: Payment processing

### Payment Queries

#### `paymentQueries.createPayment(bookingId, amount, paymentMethod)`
Creates a payment record.
- **Parameters**: bookingId, amount, paymentMethod
- **Returns**: { paymentId, transactionId }
- **Usage**: Payment confirmation

#### `paymentQueries.getPaymentByBooking(bookingId)`
Retrieves payment for a booking.
- **Parameters**: bookingId
- **Returns**: Payment object
- **Usage**: Payment verification

## State Management (Zustand)

### Auth Store

```javascript
useAuthStore.getState()
{
  user: {
    id: number,
    email: string,
    fullName: string,
    phone: string,
    address: string
  },
  isAuthenticated: boolean,
  login: (userData) => void,
  logout: () => void,
  updateProfile: (updatedData) => void
}
```

### Booking Store

```javascript
useBookingStore.getState()
{
  selectedMovie: object,
  selectedShowtime: object,
  selectedDate: string,
  selectedSeats: array,
  totalAmount: number,
  setMovie: (movie) => void,
  setShowtime: (showtime) => void,
  setDate: (date) => void,
  setSeats: (seats, amount) => void,
  clearBooking: () => void
}
```

## Screen Navigation Flow

### Authentication Flow
```
Login Screen
  ├─ Sign Up → Create Account → Back to Login
  └─ Login Success → Main Tabs

Main Tabs (Bottom Navigation)
  ├─ Movies Tab
  ├─ History Tab
  └─ Profile Tab
```

### Booking Flow
```
Movies List → Movie Details → Booking (Seat Selection) → Payment → Confirmation
                ↓
            Select Date & Showtime
```

## Component Props Documentation

### LoginScreen
- **Props**: navigation
- **State**: email, password, loading
- **Key Functions**: handleLogin(), validateEmail()

### SignUpScreen
- **Props**: navigation
- **State**: fullName, email, password, confirmPassword, phone, loading
- **Key Functions**: handleSignUp(), validateEmail(), validatePassword()

### MoviesListScreen
- **Props**: navigation
- **State**: movies, filteredMovies, searchQuery, selectedGenre, loading
- **Key Functions**: loadMovies(), filterMovies(), handleMoviePress()

### MovieDetailsScreen
- **Props**: navigation, route (movieId)
- **State**: movie, showtimes, availableDates, selectedDate, loading
- **Key Functions**: loadMovieDetails(), loadShowtimesByDate(), handleShowtimePress()

### BookingScreen
- **Props**: navigation, route (movieId, showtimeId, date)
- **State**: movie, showtime, seats, selectedSeats, loading
- **Key Functions**: loadBookingData(), handleSeatPress(), handleProceedToPayment()

### PaymentScreen
- **Props**: navigation, route (movieId, showtimeId, seatIds, totalAmount)
- **State**: paymentMethod, cardDetails, processing
- **Key Functions**: handlePayment(), validateCard()

### BookingConfirmationScreen
- **Props**: navigation, route (bookingId, bookingRef, transactionId)
- **State**: booking, seats, loading
- **Key Functions**: loadBookingDetails(), handleDone(), handleViewTickets()

### ProfileScreen
- **Props**: navigation
- **State**: isEditing, fullName, phone, address, loading
- **Key Functions**: handleSave(), handleCancel(), handleLogout()

### TicketHistoryScreen
- **Props**: navigation
- **State**: bookings, loading, refreshing, filter
- **Key Functions**: loadBookings(), onRefresh(), getFilteredBookings(), handleBookingPress()

## Error Handling

All database operations are wrapped in try-catch blocks with user-friendly error messages:

```javascript
try {
  const result = await databaseOperation();
  // Success handling
} catch (error) {
  console.error('Operation error:', error);
  Alert.alert('Error', 'User-friendly message');
}
```

## Security Considerations

1. **Password Hashing**: All passwords are hashed using bcryptjs with 10 salt rounds
2. **Input Validation**: Email, password, and form inputs are validated before processing
3. **SQL Injection Prevention**: Using parameterized queries with expo-sqlite
4. **Authentication State**: Managed globally with Zustand, persists across screens

## Performance Optimization

1. **Lazy Loading**: Components load data only when needed
2. **Memoization**: Filter and search operations are optimized
3. **Database Indexing**: Primary keys and foreign keys for fast lookups
4. **Image Optimization**: Using remote URLs with proper caching

## Future Enhancements (API Integration)

### Recommended Backend Structure

```
POST   /api/auth/register          - User registration
POST   /api/auth/login             - User login
GET    /api/movies                 - Get all movies
GET    /api/movies/:id             - Get movie details
GET    /api/showtimes/:movieId     - Get showtimes
GET    /api/seats/:showtimeId      - Get seats
POST   /api/bookings               - Create booking
GET    /api/bookings/user/:userId  - Get user bookings
POST   /api/payments               - Process payment
```

### Migration Steps

1. Create backend API endpoints matching the query functions
2. Replace database query calls with fetch/axios calls
3. Add authentication tokens to requests
4. Implement error handling for network issues
5. Add loading states and retry logic

## Testing Checklist

### Authentication
- [ ] User can sign up with valid credentials
- [ ] User cannot sign up with existing email
- [ ] User can login with correct credentials
- [ ] User cannot login with incorrect credentials
- [ ] Password is properly hashed in database

### Movie Browsing
- [ ] All movies are displayed
- [ ] Search works for titles and genres
- [ ] Genre filters work correctly
- [ ] Movie cards display correct information

### Booking Flow
- [ ] User can select a date
- [ ] Showtimes are displayed for selected date
- [ ] Seat grid displays correctly
- [ ] Available/unavailable seats are distinguished
- [ ] User can select multiple seats
- [ ] Price updates correctly

### Payment
- [ ] Payment methods can be selected
- [ ] Card validation works
- [ ] Payment processes successfully
- [ ] Booking is created in database
- [ ] Seats are marked as unavailable

### Profile & History
- [ ] User can edit profile
- [ ] Changes are saved to database
- [ ] Booking history displays correctly
- [ ] Filters work (all/upcoming/past)
- [ ] User can logout

---

**Last Updated**: November 10, 2025
**Version**: 1.0.0
