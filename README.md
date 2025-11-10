# MovieGo - Movie Ticket Booking Application

A full-featured mobile application for booking movie tickets, built with React Native, Expo, and SQLite.

## 📱 Project Overview

MovieGo is a local-first movie ticket booking system that allows users to:
- Browse available movies with search and filter
- View detailed movie information and showtimes
- Select seats and book tickets
- Process payments (mock simulation)
- Manage user profiles
- View booking history

## 🛠️ Technical Stack

- **Framework**: React Native 0.81 (JavaScript)
- **SDK**: Expo SDK 54
- **Database**: SQLite (expo-sqlite)
- **State Management**: Zustand
- **Navigation**: React Navigation v6
- **Authentication**: bcryptjs for password hashing
- **Testing Environment**: LDPlayer 9

## 📁 Project Structure

```
MovieGo/
├── App.js                          # Main application entry point
├── package.json                    # Project dependencies
├── index.js                        # Expo entry point
│
├── database/
│   ├── schema.js                   # Database schema definitions
│   └── database.js                 # Database utilities and queries
│
├── navigation/
│   └── RootNavigator.js           # Main navigation configuration
│
├── store/
│   └── store.js                    # Zustand state management
│
└── screens/
    ├── Auth/
    │   ├── LoginScreen.js         # Member 1: User login
    │   └── SignUpScreen.js        # Member 1: User registration
    │
    ├── Movies/
    │   ├── MoviesListScreen.js    # Member 1: Movie listing with search/filter
    │   └── MovieDetailsScreen.js  # Member 2: Movie details and showtimes
    │
    ├── Booking/
    │   ├── BookingScreen.js       # Member 2: Seat selection
    │   └── BookingConfirmationScreen.js # Member 3: Booking confirmation
    │
    ├── Payment/
    │   └── PaymentScreen.js       # Member 3: Payment processing
    │
    ├── Profile/
    │   └── ProfileScreen.js       # Member 5: User profile management
    │
    └── History/
        └── TicketHistoryScreen.js # Member 5: Booking history
```

## 👥 Team Member Responsibilities

### Member 1 - Authentication & Movie Listing
- **LoginScreen.js**: User authentication with email/password validation
- **SignUpScreen.js**: User registration with input validation and password hashing
- **MoviesListScreen.js**: Movie listing with search, filter by genre, and ratings display

### Member 2 - Movie Details & Booking
- **MovieDetailsScreen.js**: Comprehensive movie information with showtimes selection
- **BookingScreen.js**: Multi-step booking flow with interactive seat selection grid

### Member 3 - Payment & Confirmation
- **PaymentScreen.js**: Mock payment processing with multiple payment methods
- **BookingConfirmationScreen.js**: Booking success screen with ticket details

### Member 5 - Profile & History
- **ProfileScreen.js**: User profile viewing and editing with persistent storage
- **TicketHistoryScreen.js**: Booking history with filtering (all/upcoming/past)

## 🗄️ Database Schema

### Tables:
1. **users** - User accounts and authentication
2. **movies** - Movie catalog with details
3. **showtimes** - Movie screening schedule
4. **seats** - Seat availability for each showtime
5. **bookings** - Ticket booking records
6. **booking_seats** - Junction table for booking-seat relationship
7. **payments** - Payment transaction records

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- LDPlayer 9 (for Android emulation)

### Installation

1. **Clone or navigate to the project directory**:
   ```bash
   cd MovieGo
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

4. **Run on Android (LDPlayer)**:
   - Start LDPlayer 9
   - Enable USB debugging in LDPlayer settings
   - Run:
     ```bash
     npm run android
     ```

## 📱 Features

### 1. Authentication
- Email/password registration
- Secure password hashing with bcryptjs
- Input validation
- Persistent login state

### 2. Movie Browsing
- Grid/list view of available movies
- Search by title or genre
- Filter by genre categories
- Movie ratings and duration display

### 3. Movie Details
- Full synopsis and cast information
- Available showtimes by date
- Direct booking navigation
- Responsive poster images

### 4. Ticket Booking
- Interactive seat selection grid
- Real-time seat availability
- Screen layout visualization
- Multi-seat selection (up to 10)
- Dynamic price calculation

### 5. Payment Processing
- Multiple payment methods (Card, Wallet, UPI)
- Card detail validation
- Mock payment simulation
- Transaction ID generation
- Booking reference generation

### 6. User Profile
- View and edit personal information
- Phone and address management
- Account statistics dashboard
- Settings and preferences

### 7. Booking History
- Chronological booking list
- Filter by status (all/upcoming/past)
- Detailed ticket information
- Pull-to-refresh functionality

## 🎨 Design System

### Color Palette
- **Primary Background**: `#0f3460` (Dark Blue)
- **Secondary Background**: `#16213e` (Navy Blue)
- **Accent/Primary**: `#e94560` (Red/Pink)
- **Text Primary**: `#ffffff` (White)
- **Text Secondary**: `#aaaaaa` (Light Gray)
- **Success**: `#4caf50` (Green)
- **Error**: `#d32f2f` (Red)

### Typography
- **Headings**: Bold, 20-28px
- **Body**: Regular, 14-16px
- **Caption**: 12-13px

## 🔧 Configuration

### Database Configuration
The database is automatically initialized on app startup with:
- Schema creation
- Sample movie data (5 movies)
- Showtimes generation (7 days ahead)
- Seat layout generation (8 rows × 10 seats)

### Navigation Structure
```
Auth Stack (Unauthenticated)
├── Login
└── Sign Up

Main Tabs (Authenticated)
├── Movies Tab
│   ├── Movies List
│   ├── Movie Details
│   ├── Booking
│   ├── Payment
│   └── Confirmation
├── History Tab
│   └── Ticket History
└── Profile Tab
    └── Profile
```

## 📝 API-Ready Architecture

The application is designed with a clean separation between UI and data layer, making it easy to integrate with a backend API:

### Current: Local SQLite
```javascript
const movies = await movieQueries.getAllMovies();
```

### Future: API Integration
```javascript
const movies = await fetch('/api/movies').then(r => r.json());
```

All query functions in `database/database.js` can be replaced with API calls without changing the UI components.

## 🧪 Testing

### Test Accounts
Create your own account through the Sign Up screen.

### Sample Data
The app comes pre-loaded with 5 popular movies and showtimes for the next 7 days.

## 📄 License

This project is created for educational purposes as part of MMA301 course project.

## 👨‍💻 Development Notes

### Member 1 Tasks
- Implemented user authentication flow
- Created movie listing with search and filter
- Added email/password validation
- Integrated bcryptjs for password security

### Member 2 Tasks
- Developed movie details screen with showtime selection
- Created interactive seat selection interface
- Implemented seat availability logic
- Built booking flow navigation

### Member 3 Tasks
- Designed payment screen with multiple methods
- Implemented card validation
- Created booking confirmation screen
- Integrated payment with booking system

### Member 5 Tasks
- Built user profile management
- Created editable profile form
- Developed ticket history screen
- Added booking filters and refresh

## 🐛 Troubleshooting

### Database Issues
If the database doesn't initialize:
1. Clear app data
2. Restart the app
3. Check console for error messages

### Navigation Issues
Ensure all navigation dependencies are installed:
```bash
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
```

### Expo SQLite Issues
Make sure you're using the correct version:
```bash
expo install expo-sqlite
```

## 📞 Support

For issues or questions, please refer to:
- Expo Documentation: https://docs.expo.dev/
- React Navigation: https://reactnavigation.org/
- SQLite: https://www.sqlite.org/docs.html

---

**MovieGo** - Your Gateway to Cinema 🎬
