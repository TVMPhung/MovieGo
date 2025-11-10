# MovieGo Setup Guide

## Prerequisites Installation

### 1. Install Node.js
- Download from: https://nodejs.org/
- Recommended version: 14.x or higher
- Verify installation:
  ```bash
  node --version
  npm --version
  ```

### 2. Install Expo CLI
```bash
npm install -g expo-cli
```

### 3. Install LDPlayer 9
- Download from: https://www.ldplayer.net/
- Install and launch LDPlayer
- Recommended settings:
  - Android version: Android 9
  - RAM: 4GB
  - CPU: 4 cores

## Project Setup

### Step 1: Navigate to Project Directory
```bash
cd d:\FA25\MMA301\Project_Group\MovieGo
```

### Step 2: Install Dependencies
```bash
npm install
```

This will install:
- React Native and Expo dependencies
- React Navigation libraries
- SQLite database
- Zustand state management
- bcryptjs for password hashing
- All other required packages

### Step 3: Verify Installation
Check if all dependencies are installed:
```bash
npm list --depth=0
```

Expected packages:
- @react-navigation/bottom-tabs
- @react-navigation/native
- @react-navigation/native-stack
- bcryptjs
- expo
- expo-sqlite
- expo-status-bar
- react
- react-native
- react-native-safe-area-context
- react-native-screens
- zustand

## Running the Application

### Method 1: Using Expo Go (Easiest)

1. **Start the development server**:
   ```bash
   npm start
   ```

2. **Install Expo Go on your device**:
   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent
   - iOS: https://apps.apple.com/app/expo-go/id982107779

3. **Scan the QR code** displayed in the terminal or browser

### Method 2: Using LDPlayer 9 (Recommended for Testing)

1. **Launch LDPlayer**

2. **Enable USB Debugging in LDPlayer**:
   - Open LDPlayer Settings
   - Go to Other Settings
   - Enable "Root permission"
   - Enable "ADB debugging"

3. **Connect LDPlayer to your development environment**:
   - Find LDPlayer's ADB port (usually 5555 or 5037)
   - In terminal:
     ```bash
     adb connect 127.0.0.1:5555
     ```
   - Verify connection:
     ```bash
     adb devices
     ```

4. **Start the app on LDPlayer**:
   ```bash
   npm run android
   ```

### Method 3: Using Android Studio Emulator

1. **Install Android Studio**:
   - Download from: https://developer.android.com/studio

2. **Set up Android Emulator**:
   - Open Android Studio → AVD Manager
   - Create a new virtual device
   - Select Pixel 5 or similar
   - System image: Android 11 or higher

3. **Start the emulator and run**:
   ```bash
   npm run android
   ```

## Troubleshooting

### Problem: "Command not found: expo"
**Solution**:
```bash
npm install -g expo-cli
```

### Problem: "Cannot connect to Metro bundler"
**Solution**:
1. Kill all node processes:
   ```bash
   # Windows PowerShell
   Stop-Process -Name node -Force
   ```
2. Clear cache:
   ```bash
   npm start -- --clear
   ```

### Problem: "Unable to resolve module @react-navigation/native"
**Solution**:
```bash
npm install
```
If still not working:
```bash
rm -rf node_modules
npm install
```

### Problem: "Database not opening"
**Solution**:
1. Clear app data on device/emulator
2. Restart the app
3. Check console for specific error messages

### Problem: "ADB device not found"
**Solution for LDPlayer**:
1. Close LDPlayer
2. Open LDPlayer installation directory
3. Run `adb.exe kill-server`
4. Run `adb.exe start-server`
5. Restart LDPlayer
6. Try connecting again

### Problem: "Metro bundler stuck at 'Loading dependency graph'"
**Solution**:
```bash
# Windows PowerShell
npm start -- --reset-cache
```

### Problem: "React Native version mismatch"
**Solution**:
This project uses React Native 0.81.5 with Expo SDK 54. Make sure you're not mixing versions:
```bash
npm install
```

## Development Workflow

### 1. Making Changes
- Edit files in `screens/`, `database/`, `navigation/`, or `store/`
- Save the file
- App will automatically reload (Fast Refresh)

### 2. Database Changes
If you modify the database schema:
1. Uninstall the app from device/emulator
2. Reinstall to trigger fresh database initialization

### 3. Adding New Packages
```bash
npm install <package-name>
```
Then restart the development server:
```bash
npm start
```

### 4. Debugging
- Open Chrome DevTools: Press `j` in terminal when Metro is running
- View logs: Check terminal output
- React Native Debugger: Press `Ctrl+M` (Android) or `Cmd+D` (iOS) in app

## Building for Production

### Android APK

1. **Build APK**:
   ```bash
   expo build:android -t apk
   ```

2. **Follow prompts** to configure Android keystore

3. **Download APK** when build completes

### iOS (Requires Mac)

1. **Build IPA**:
   ```bash
   expo build:ios
   ```

2. **Follow prompts** for Apple credentials

3. **Download IPA** when build completes

## Project Structure Quick Reference

```
MovieGo/
├── App.js                 # Main entry point with database initialization
├── package.json           # Dependencies and scripts
│
├── database/
│   ├── schema.js         # Database tables and sample data
│   └── database.js       # Query functions (CRUD operations)
│
├── navigation/
│   └── RootNavigator.js  # Navigation configuration
│
├── store/
│   └── store.js          # Global state management
│
└── screens/
    ├── Auth/             # Login & Sign Up (Member 1)
    ├── Movies/           # List & Details (Member 1 & 2)
    ├── Booking/          # Seat selection & Confirmation (Member 2 & 3)
    ├── Payment/          # Payment processing (Member 3)
    ├── Profile/          # User profile (Member 5)
    └── History/          # Ticket history (Member 5)
```

## Default Test Data

The app comes with pre-loaded sample data:

### Movies (5 movies):
- Avengers: Endgame
- The Shawshank Redemption
- Inception
- The Dark Knight
- Interstellar

### Showtimes:
- Generated for next 7 days
- 5 showtimes per day per movie
- Times: 10:00, 13:00, 16:00, 19:00, 22:00

### Seats:
- 8 rows (A-H)
- 10 seats per row
- 80 seats total per showtime

### Test Account:
Create your own account through the Sign Up screen.

## Environment Variables

For production deployment, create a `.env` file:

```env
API_URL=https://your-api-url.com
DATABASE_NAME=moviego.db
```

## Support & Resources

- **Expo Documentation**: https://docs.expo.dev/
- **React Native**: https://reactnative.dev/
- **React Navigation**: https://reactnavigation.org/
- **SQLite**: https://www.sqlite.org/
- **Zustand**: https://github.com/pmndrs/zustand

## Common Commands

```bash
# Start development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Clear cache and restart
npm start -- --clear

# Install dependencies
npm install

# Check for updates
npm outdated

# Update packages
npm update
```

## Tips for Success

1. **Always restart after installing new packages**
2. **Use Fast Refresh** - save files to see changes instantly
3. **Check terminal logs** for errors
4. **Clear cache** if you see unexpected behavior
5. **Keep dependencies updated** but test thoroughly
6. **Use LDPlayer** for consistent testing environment
7. **Backup your database** before making schema changes

---

**Need Help?** Check the README.md and DOCUMENTATION.md files for more detailed information.

**Ready to Start?** Run `npm start` and begin exploring MovieGo!
