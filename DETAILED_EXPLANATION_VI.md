# GIẢI THÍCH CHI TIẾT CODE - LOCATIONS, SUPPORT, PROFILE

## Ngày: 11 Tháng 11, 2025

---

## MỤC LỤC

1. [Quy Luật Thực Thi Chung](#1-quy-luật-thực-thi-chung)
2. [LOCATIONS - MapScreen](#2-locations---mapscreen)
3. [PROFILE - ProfileScreen](#3-profile---profilescreen)
4. [SUPPORT - Các Screen Hỗ Trợ](#4-support---các-screen-hỗ-trợ)

---

## 1. QUY LUẬT THỰC THI CHUNG

### 1.1. Component Lifecycle (Vòng đời Component)

```
Mount → useEffect() → Render → User Interaction → State Change → Re-render → Unmount
```

### 1.2. State Management (Quản lý State)

```javascript
// ✅ ĐÚNG: Immutable update
setState({ ...state, name: 'New' });

// ❌ SAI: Direct mutation
state.name = 'New';
```

### 1.3. Async Operations (Xử lý bất đồng bộ)

```javascript
const handleAsync = async () => {
  setLoading(true);
  try {
    const result = await apiCall();
    setState(result);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};
```

---

## 2. LOCATIONS - MapScreen

### 2.1. Cấu Trúc Component

```javascript
const MapScreen = ({ navigation }) => {
  // ==================== STATE MANAGEMENT ====================
  
  // State 1: Location đang được chọn
  const [selectedLocation, setSelectedLocation] = useState(null);
  
  // State 2: Vị trí GPS hiện tại của user
  const [currentLocation, setCurrentLocation] = useState(null);
  
  // State 3: Trạng thái quyền truy cập vị trí
  const [locationPermission, setLocationPermission] = useState(null);
  
  // State 4: Trạng thái đang tải vị trí
  const [loadingLocation, setLoadingLocation] = useState(false);
  
  // ... rest of component
};
```

### 2.2. useEffect - Request Permission Khi Mount

```javascript
// QUY LUẬT: useEffect với dependency array rỗng [] chỉ chạy 1 lần khi component mount
useEffect(() => {
  requestLocationPermission();
}, []); // ← [] nghĩa là chỉ chạy lần đầu
```

**Giải thích:**
- `useEffect` là React Hook để xử lý side effects
- Chạy sau khi component render lần đầu
- Với `[]`, effect chỉ chạy 1 lần khi component mount
- Dùng để request permission ngay khi user vào trang

### 2.3. Request Location Permission - Luồng Thực Thi

```javascript
const requestLocationPermission = async () => {
  try {
    // Bước 1: Gọi API expo-location để xin quyền
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    // Bước 2: Lưu trạng thái permission vào state
    setLocationPermission(status === 'granted');
    
    // Bước 3: Kiểm tra kết quả
    if (status === 'granted') {
      // Permission được cấp - có thể dùng GPS
      console.log('Permission granted');
    } else {
      // Permission bị từ chối
      console.log('Permission denied');
    }
  } catch (error) {
    // Bước 4: Xử lý lỗi (nếu có)
    console.error('Error:', error);
    setLocationPermission(false);
  }
};
```

**Chi tiết từng bước:**

1. **`await Location.requestForegroundPermissionsAsync()`**
   - Hiển thị popup xin quyền truy cập vị trí
   - Trả về object: `{ status: 'granted' | 'denied' }`
   - `foreground` = chỉ xin quyền khi app đang mở

2. **`setLocationPermission(status === 'granted')`**
   - Chuyển đổi 'granted' thành `true`
   - Chuyển đổi 'denied' thành `false`
   - Lưu vào state để UI biết và hiển thị tương ứng

3. **Try-Catch Block**
   - Bắt lỗi nếu API gặp sự cố
   - Đảm bảo app không crash

### 2.4. Get Current Location - GPS Detection

```javascript
const getCurrentLocation = async () => {
  // BƯỚC 1: Bật loading indicator
  setLoadingLocation(true);
  
  try {
    // BƯỚC 2: Kiểm tra permission lại (để chắc chắn)
    const { status } = await Location.getForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      // BƯỚC 3a: Nếu không có permission → Hiện alert
      Alert.alert(
        'Yêu cầu quyền truy cập vị trí',
        'Vui lòng bật dịch vụ vị trí...',
        [
          { text: 'Hủy', style: 'cancel' },
          { text: 'Mở Cài đặt', onPress: () => Linking.openSettings() }
        ]
      );
      setLoadingLocation(false);
      return null; // Dừng function
    }

    // BƯỚC 3b: Nếu có permission → Lấy GPS
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced, // ← Độ chính xác trung bình
      timeout: 10000,    // ← Timeout sau 10 giây
      maximumAge: 60000, // ← Cache 1 phút
    });

    // BƯỚC 4: Extract dữ liệu cần thiết
    const userLocation = {
      latitude: location.coords.latitude,   // ← Vĩ độ (10.0452 cho Cần Thơ)
      longitude: location.coords.longitude, // ← Kinh độ (105.7469 cho Cần Thơ)
      accuracy: location.coords.accuracy,   // ← Độ chính xác (meters)
    };

    // BƯỚC 5: Lưu vào state
    setCurrentLocation(userLocation);
    setLoadingLocation(false);
    return userLocation; // Trả về để function khác dùng

  } catch (error) {
    // BƯỚC 6: Xử lý lỗi
    setLoadingLocation(false);
    console.error('Error getting location:', error);
    
    Alert.alert('Lỗi vị trí', 'Không thể lấy vị trí...');
    return null;
  }
};
```

**Giải thích các tham số GPS:**

| Tham số | Ý nghĩa | Giá trị |
|---------|---------|---------|
| `accuracy` | Độ chính xác GPS | `Balanced` = ±10-50m (tốt cho định vị) |
| `timeout` | Thời gian chờ tối đa | `10000` = 10 giây |
| `maximumAge` | Cache vị trí | `60000` = 1 phút (tiết kiệm pin) |

**Tại sao cần cache (maximumAge)?**
- GPS tốn pin
- Vị trí không thay đổi nhanh (trong 1 phút)
- Dùng lại vị trí cũ nếu chưa quá 1 phút

### 2.5. Cinema Locations Data - Cấu Trúc Dữ Liệu

```javascript
const cinemaLocations = [
  {
    id: 6,                                    // ← ID duy nhất
    name: 'MovieGo Cinema Cần Thơ',          // ← Tên rạp
    address: '209 Đường 30 Tháng 4, Phường Xuân Khánh, Quận Ninh Kiều',
    city: 'Cần Thơ',                         // ← Thành phố
    phone: '+84 292 3812 345',               // ← SĐT (định dạng VN)
    latitude: 10.0452,                        // ← Tọa độ GPS
    longitude: 105.7469,
    screens: 8,                               // ← Số phòng chiếu
    parking: 'Bãi đậu xe rộng rãi',          // ← Thông tin đỗ xe
    facilities: [                             // ← Danh sách tiện ích
      'IMAX', 
      '3D', 
      'Dolby Atmos', 
      'Khu vui chơi trẻ em'
    ],
  },
  // ... 5 rạp khác
];
```

**Cách thức hoạt động:**
1. Data lưu trong component (hardcoded)
2. Không cần database cho dữ liệu tĩnh này
3. Mỗi rạp có GPS coordinates chính xác
4. Dùng `map()` để render từng rạp thành UI

### 2.6. Open In Maps - Platform-Specific URLs

```javascript
const openInMaps = (location) => {
  // BƯỚC 1: Extract dữ liệu cần thiết
  const { latitude, longitude, name } = location;
  
  // BƯỚC 2: Tạo URL khác nhau cho iOS và Android
  const url = Platform.select({
    ios: `maps:0,0?q=${name}@${latitude},${longitude}`,
    android: `geo:0,0?q=${latitude},${longitude}(${name})`,
  });
  
  // BƯỚC 3: Kiểm tra device có thể mở URL không
  Linking.canOpenURL(url).then((supported) => {
    if (supported) {
      // BƯỚC 4a: Mở app Maps native
      Linking.openURL(url);
    } else {
      // BƯỚC 4b: Fallback → Mở Google Maps web
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
      Linking.openURL(googleMapsUrl);
    }
  });
};
```

**Platform.select() - Giải thích:**

```javascript
Platform.select({
  ios: 'Apple code',      // ← Chạy trên iPhone/iPad
  android: 'Android code', // ← Chạy trên Android
  web: 'Web code',        // ← Chạy trên browser
  default: 'Fallback'     // ← Mặc định nếu không khớp
})
```

**URL Schemes:**

| Platform | URL Format | Ý nghĩa |
|----------|-----------|---------|
| iOS | `maps:0,0?q=Name@lat,lng` | Mở Apple Maps với location |
| Android | `geo:0,0?q=lat,lng(Name)` | Mở Google Maps với location |
| Web | `https://www.google.com/maps/search/?api=1&query=lat,lng` | Google Maps web |

### 2.7. Render Location Card - Luồng UI

```javascript
const renderLocationCard = (location) => (
  <TouchableOpacity
    key={location.id}  // ← Key để React track element
    style={[
      styles.locationCard,
      // Conditional styling: Nếu card được chọn → border đỏ
      selectedLocation?.id === location.id && styles.locationCardSelected
    ]}
    onPress={() => setSelectedLocation(location)} // ← Set state khi tap
  >
    {/* PHẦN 1: Header với icon và tên */}
    <View style={styles.locationHeader}>
      <View style={styles.locationIconContainer}>
        <Ionicons name="location" size={28} color="#e94560" />
      </View>
      <View style={styles.locationInfo}>
        <Text style={styles.locationName}>{location.name}</Text>
        <Text style={styles.locationCity}>{location.city}</Text>
      </View>
    </View>

    {/* PHẦN 2: Chi tiết (address, phone, screens, parking) */}
    <View style={styles.locationDetails}>
      {/* 4 dòng thông tin */}
    </View>

    {/* PHẦN 3: Expanded section (chỉ hiện khi được chọn) */}
    {selectedLocation?.id === location.id && (
      <View style={styles.expandedSection}>
        {/* Facilities */}
        {/* Action Buttons: Directions, Call */}
      </View>
    )}
  </TouchableOpacity>
);
```

**Conditional Rendering - Logic:**

```javascript
// Cách 1: && operator
{condition && <Component />}
// Nếu condition = true → render Component
// Nếu condition = false → không render gì

// Cách 2: Ternary operator
{condition ? <ComponentA /> : <ComponentB />}
// Nếu condition = true → render ComponentA
// Nếu condition = false → render ComponentB

// Ví dụ trong code:
{selectedLocation?.id === location.id && (
  <View>...</View>
)}
// Chỉ hiện View nếu card này đang được chọn
```

### 2.8. Main Render - Cấu Trúc Trang

```javascript
return (
  <View style={styles.container}>
    {/* SECTION 1: Header */}
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Cinema Locations</Text>
      <Text style={styles.headerSubtitle}>
        Tìm rạp chiếu phim MovieGo gần bạn
      </Text>
    </View>

    {/* SECTION 2: Map Placeholder */}
    <View style={styles.mapPlaceholder}>
      <Ionicons name="map" size={64} color="#e94560" />
      <Text>Interactive Map View</Text>
    </View>

    {/* SECTION 3: Scrollable List */}
    <ScrollView style={styles.locationsList}>
      <Text style={styles.sectionTitle}>
        All Locations ({cinemaLocations.length})
      </Text>
      {cinemaLocations.map(renderLocationCard)}
      {/* ↑ Render 6 cards từ array */}
    </ScrollView>
  </View>
);
```

**Map Function - Giải thích:**

```javascript
// Array.map() biến đổi array thành array mới
const numbers = [1, 2, 3];
const doubled = numbers.map(num => num * 2);
// doubled = [2, 4, 6]

// Trong React: map() để render list
cinemaLocations.map(location => (
  <Component data={location} />
))
// Tạo 6 Component từ 6 location objects
```

### 2.9. Styles - StyleSheet API

```javascript
const styles = StyleSheet.create({
  container: {
    flex: 1,                      // ← Chiếm toàn bộ màn hình
    backgroundColor: '#0f3460',   // ← Màu nền xanh đậm
  },
  locationCard: {
    backgroundColor: '#16213e',
    borderRadius: 12,             // ← Bo góc 12px
    padding: 15,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#16213e',       // ← Border mặc định (không thấy)
  },
  locationCardSelected: {
    borderColor: '#e94560',       // ← Border đỏ khi được chọn
  },
  // ... 30+ styles khác
});
```

**Flexbox - Layout System:**

```javascript
// Flex Direction
flexDirection: 'row'    // ← Xếp ngang (→)
flexDirection: 'column' // ← Xếp dọc (↓) [mặc định]

// Alignment
justifyContent: 'center'      // ← Căn giữa theo main axis
alignItems: 'center'          // ← Căn giữa theo cross axis
justifyContent: 'space-between' // ← Khoảng cách đều

// Sizing
flex: 1  // ← Chiếm không gian còn lại
```

---

## 3. PROFILE - ProfileScreen

### 3.1. State Management - Overview

```javascript
const ProfileScreen = ({ navigation }) => {
  // ==================== ZUSTAND GLOBAL STATE ====================
  const user = useAuthStore((state) => state.user);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const logout = useAuthStore((state) => state.logout);

  // ==================== LOCAL STATE ====================
  // Form data
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [loading, setLoading] = useState(false);
  
  // Statistics data
  const [stats, setStats] = useState({
    totalBookings: 0,
    moviesWatched: 0,
    totalSpent: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);
  
  // Validation errors
  const [fullNameError, setFullNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
};
```

**Zustand vs Local State:**

| Loại State | Khi nào dùng | Ví dụ |
|------------|--------------|-------|
| Zustand (Global) | Dữ liệu dùng nhiều nơi | `user`, `updateProfile`, `logout` |
| Local State | Dữ liệu chỉ dùng trong component | `isEditing`, `fullName`, `stats` |

### 3.2. useEffect - Load Initial Data

```javascript
useEffect(() => {
  if (user) {
    // BƯỚC 1: Đồng bộ form với user data từ Zustand
    setFullName(user.fullName || '');
    setPhone(user.phone || '');
    setAddress(user.address || '');
    
    // BƯỚC 2: Load statistics từ database
    loadAccountStatistics();
  }
}, [user]); // ← Chạy lại khi user thay đổi
```

**Dependency Array Explained:**

```javascript
// Case 1: Không có dependency array
useEffect(() => {
  // Chạy sau MỖI lần render
});

// Case 2: Empty array []
useEffect(() => {
  // Chỉ chạy 1 lần khi mount
}, []);

// Case 3: Có dependencies
useEffect(() => {
  // Chạy khi user thay đổi
}, [user]);
```

### 3.3. Load Account Statistics - Database Query

```javascript
const loadAccountStatistics = async () => {
  if (!user?.id) return; // ← Early return nếu không có user
  
  setLoadingStats(true);
  
  try {
    // BƯỚC 1: Query database lấy tất cả bookings của user
    const bookings = await bookingQueries.getUserBookings(user.id);
    
    if (bookings && bookings.length > 0) {
      // BƯỚC 2: Tính toán statistics
      
      // 2a. Total Bookings = số lượng bookings
      const totalBookings = bookings.length;
      
      // 2b. Movies Watched = số lượng phim UNIQUE
      const uniqueMovies = new Set(bookings.map(b => b.movie_id));
      const moviesWatched = uniqueMovies.size;
      
      // 2c. Total Spent = tổng số tiền
      const totalSpent = bookings.reduce(
        (sum, booking) => sum + booking.total_amount, 
        0  // ← Giá trị khởi đầu
      );
      
      // BƯỚC 3: Update state
      setStats({
        totalBookings,
        moviesWatched,
        totalSpent: totalSpent.toFixed(2), // ← Làm tròn 2 chữ số thập phân
      });
    } else {
      // Không có bookings → Set 0
      setStats({
        totalBookings: 0,
        moviesWatched: 0,
        totalSpent: '0.00',
      });
    }
  } catch (error) {
    console.error('Error loading statistics:', error);
    // Set 0 nếu có lỗi
    setStats({ totalBookings: 0, moviesWatched: 0, totalSpent: '0.00' });
  } finally {
    setLoadingStats(false); // ← Luôn chạy (dù success hay error)
  }
};
```

**JavaScript Methods Explained:**

```javascript
// 1. Array.map() - Biến đổi array
const ids = bookings.map(booking => booking.movie_id);
// [booking1, booking2] → [movie_id1, movie_id2]

// 2. Set - Loại bỏ duplicate
const uniqueMovies = new Set([1, 2, 2, 3, 3, 3]);
// Set {1, 2, 3} → size = 3

// 3. Array.reduce() - Gộp array thành 1 giá trị
const total = [10, 20, 30].reduce((sum, num) => sum + num, 0);
// 0 + 10 = 10
// 10 + 20 = 30
// 30 + 30 = 60

// 4. Number.toFixed() - Làm tròn decimal
(123.456).toFixed(2) → "123.46"
```

### 3.4. Real-time Validation - Input Change Handlers

```javascript
// Validate full name khi user gõ
const handleFullNameChange = (text) => {
  // BƯỚC 1: Update state với giá trị mới
  setFullName(text);
  
  // BƯỚC 2: Chỉ validate khi đang ở edit mode
  if (isEditing) {
    // BƯỚC 3: Gọi validation function
    const validation = validateFullName(text);
    
    // BƯỚC 4: Update error message
    setFullNameError(validation.error);
    // Nếu valid → error = ''
    // Nếu invalid → error = 'Full name cannot contain...'
  }
};

// Validate phone khi user gõ
const handlePhoneChange = (text) => {
  setPhone(text);
  if (isEditing) {
    const validation = validatePhone(text, true); // true = optional
    setPhoneError(validation.error);
  }
};
```

**Validation Logic Flow:**

```javascript
User gõ text
    ↓
handleXxxChange(text) được gọi
    ↓
Update state: setXxx(text)
    ↓
Kiểm tra: isEditing === true?
    ↓
Gọi validateXxx(text)
    ↓
Nhận kết quả: { isValid: true/false, error: '' }
    ↓
Update error state: setXxxError(error)
    ↓
UI tự động re-render với error mới
```

### 3.5. Save Profile - Full Validation & Database Update

```javascript
const handleSave = async () => {
  // ==================== BƯỚC 1: VALIDATE TẤT CẢ ====================
  const fullNameValidation = validateFullName(fullName);
  const phoneValidation = validatePhone(phone, true); // Optional

  // Update UI với error messages
  setFullNameError(fullNameValidation.error);
  setPhoneError(phoneValidation.error);

  // ==================== BƯỚC 2: CHECK VALIDATION ====================
  if (!fullNameValidation.isValid || !phoneValidation.isValid) {
    Alert.alert('Validation Error', 'Please fix the errors before saving');
    return; // Dừng function, không save
  }

  // ==================== BƯỚC 3: SET LOADING ====================
  setLoading(true);

  try {
    // ==================== BƯỚC 4: CLEAN DATA ====================
    // Remove spaces, hyphens, parentheses from phone
    const cleanPhone = phone ? phone.replace(/[\s\-()]/g, '') : '';
    // '0123 456 789' → '0123456789'
    
    // ==================== BƯỚC 5: UPDATE DATABASE ====================
    await userQueries.updateUser(
      user.id,
      fullName.trim(),  // ← Remove leading/trailing spaces
      cleanPhone,
      address.trim()
    );

    // ==================== BƯỚC 6: UPDATE ZUSTAND STATE ====================
    updateProfile({
      fullName: fullName.trim(),
      phone: cleanPhone,
      address: address.trim(),
    });

    // ==================== BƯỚC 7: RESET UI STATE ====================
    setLoading(false);
    setIsEditing(false);
    setFullNameError('');
    setPhoneError('');
    
    // ==================== BƯỚC 8: SHOW SUCCESS ====================
    Alert.alert('Success', 'Profile updated successfully!');
    
  } catch (error) {
    // ==================== BƯỚC 9: ERROR HANDLING ====================
    console.error('Error updating profile:', error);
    Alert.alert('Error', 'Failed to update profile. Please try again.');
    setLoading(false);
  }
};
```

**Try-Catch-Finally Pattern:**

```javascript
try {
  // Code có thể throw error
  await riskyOperation();
  console.log('Success');
} catch (error) {
  // Chỉ chạy nếu có error
  console.error('Error:', error);
} finally {
  // LUÔN chạy (dù success hay error)
  setLoading(false);
}
```

### 3.6. Cancel Edit - Reset State

```javascript
const handleCancel = () => {
  // BƯỚC 1: Reset về giá trị gốc từ user object
  setFullName(user.fullName || '');
  setPhone(user.phone || '');
  setAddress(user.address || '');
  
  // BƯỚC 2: Clear error messages
  setFullNameError('');
  setPhoneError('');
  
  // BƯỚC 3: Thoát edit mode
  setIsEditing(false);
};
```

### 3.7. Logout - Confirmation Dialog

```javascript
const handleLogout = () => {
  // Hiện dialog xác nhận
  Alert.alert(
    'Logout',                          // ← Title
    'Are you sure you want to logout?', // ← Message
    [
      // Button 1: Cancel
      { 
        text: 'Cancel', 
        style: 'cancel' 
      },
      // Button 2: Logout
      {
        text: 'Logout',
        style: 'destructive',          // ← Màu đỏ (iOS)
        onPress: () => logout(),       // ← Gọi Zustand logout
      },
    ]
  );
};
```

**Alert.alert() - Dialog Patterns:**

```javascript
// Pattern 1: Simple alert
Alert.alert('Title', 'Message');

// Pattern 2: Alert với buttons
Alert.alert('Title', 'Message', [
  { text: 'Cancel', onPress: () => {} },
  { text: 'OK', onPress: () => {} },
]);

// Pattern 3: Destructive action
Alert.alert('Delete?', 'This cannot be undone', [
  { text: 'Cancel', style: 'cancel' },
  { text: 'Delete', style: 'destructive', onPress: handleDelete },
]);
```

### 3.8. Render - Statistics Section

```javascript
<View style={styles.statsCard}>
  <Text style={styles.cardTitle}>Account Statistics</Text>
  
  {loadingStats ? (
    // CASE 1: Đang load → Hiện spinner
    <ActivityIndicator size="large" color="#e94560" />
  ) : (
    // CASE 2: Đã load xong → Hiện data
    <View style={styles.statsGrid}>
      {/* Stat 1: Total Bookings */}
      <View style={styles.statItem}>
        <Ionicons name="ticket" size={32} color="#e94560" />
        <Text style={styles.statLabel}>Total Bookings</Text>
        <Text style={styles.statValue}>{stats.totalBookings}</Text>
      </View>
      
      {/* Stat 2: Movies Watched */}
      <View style={styles.statItem}>
        <Ionicons name="film" size={32} color="#e94560" />
        <Text style={styles.statLabel}>Movies Watched</Text>
        <Text style={styles.statValue}>{stats.moviesWatched}</Text>
      </View>
      
      {/* Stat 3: Total Spent */}
      <View style={styles.statItem}>
        <Ionicons name="cash" size={32} color="#e94560" />
        <Text style={styles.statLabel}>Total Spent</Text>
        <Text style={styles.statValue}>${stats.totalSpent}</Text>
      </View>
    </View>
  )}
</View>
```

### 3.9. Render - Settings Navigation

```javascript
<View style={styles.settingsCard}>
  <Text style={styles.cardTitle}>Settings</Text>
  
  {/* Setting 1: Notifications */}
  <TouchableOpacity 
    style={styles.settingItem}
    onPress={() => navigation.navigate('Notifications')}
  >
    <Ionicons name="notifications-outline" size={24} color="#aaa" />
    <Text style={styles.settingText}>Notifications</Text>
    <Ionicons name="chevron-forward" size={24} color="#aaa" />
  </TouchableOpacity>

  {/* Setting 2: Change Password */}
  <TouchableOpacity 
    style={styles.settingItem}
    onPress={() => navigation.navigate('ChangePassword')}
  >
    <Ionicons name="lock-closed-outline" size={24} color="#aaa" />
    <Text style={styles.settingText}>Change Password</Text>
    <Ionicons name="chevron-forward" size={24} color="#aaa" />
  </TouchableOpacity>

  {/* Setting 3: Help & Support */}
  <TouchableOpacity 
    style={styles.settingItem}
    onPress={() => navigation.navigate('HelpSupport')}
  >
    <Ionicons name="help-circle-outline" size={24} color="#aaa" />
    <Text style={styles.settingText}>Help & Support</Text>
    <Ionicons name="chevron-forward" size={24} color="#aaa" />
  </TouchableOpacity>

  {/* Setting 4: Terms & Conditions */}
  <TouchableOpacity 
    style={styles.settingItem}
    onPress={() => navigation.navigate('TermsConditions')}
  >
    <Ionicons name="document-text-outline" size={24} color="#aaa" />
    <Text style={styles.settingText}>Terms & Conditions</Text>
    <Ionicons name="chevron-forward" size={24} color="#aaa" />
  </TouchableOpacity>
</View>
```

**React Navigation - navigate():**

```javascript
// Basic navigation
navigation.navigate('ScreenName');

// Navigate với params
navigation.navigate('ScreenName', { userId: 123 });

// Go back
navigation.goBack();

// Reset stack
navigation.reset({
  index: 0,
  routes: [{ name: 'Home' }],
});
```

---

## 4. SUPPORT - CÁC SCREEN HỖ TRỢ

### 4.1. NotificationScreen - Cấu Trúc

```javascript
const NotificationScreen = () => {
  // ==================== STATE ====================
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [movieUpdates, setMovieUpdates] = useState(true);
  const [bookingConfirm, setBookingConfirm] = useState(true);
  const [promotions, setPromotions] = useState(true);

  // ==================== RENDER ====================
  return (
    <ScrollView style={styles.container}>
      {/* Section 1: Push Notifications */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Push Notifications</Text>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingText}>Enable Push</Text>
          <Switch 
            value={pushEnabled}
            onValueChange={setPushEnabled}
            trackColor={{ false: '#767577', true: '#e94560' }}
          />
        </View>
        {/* More switches... */}
      </View>

      {/* Section 2: Email Notifications */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Email Notifications</Text>
        {/* Email switches... */}
      </View>

      {/* Section 3: SMS Notifications */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>SMS Notifications</Text>
        {/* SMS switches... */}
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save Preferences</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};
```

**Switch Component:**

```javascript
<Switch 
  value={isEnabled}              // ← Current state (true/false)
  onValueChange={setIsEnabled}   // ← Function to update state
  trackColor={{                  // ← Colors
    false: '#767577',            // ← Off color (gray)
    true: '#e94560'              // ← On color (red)
  }}
  thumbColor={isEnabled ? '#fff' : '#f4f3f4'} // ← Thumb color
/>
```

### 4.2. HelpSupportScreen - FAQ Accordion

```javascript
const HelpSupportScreen = () => {
  // ==================== STATE ====================
  const [expandedFaq, setExpandedFaq] = useState(null);

  // ==================== DATA ====================
  const faqs = [
    {
      id: 1,
      question: 'How do I book a movie ticket?',
      answer: 'Browse movies, select showtime, choose seats, and confirm payment.'
    },
    {
      id: 2,
      question: 'Can I cancel my booking?',
      answer: 'Yes, you can cancel up to 2 hours before the showtime.'
    },
    // ... more FAQs
  ];

  // ==================== RENDER FAQ ====================
  const renderFaq = (faq) => (
    <View key={faq.id} style={styles.faqItem}>
      {/* Question - Touchable header */}
      <TouchableOpacity 
        style={styles.faqQuestion}
        onPress={() => setExpandedFaq(
          expandedFaq === faq.id ? null : faq.id
        )}
      >
        <Text style={styles.faqQuestionText}>{faq.question}</Text>
        <Ionicons 
          name={expandedFaq === faq.id ? 'chevron-up' : 'chevron-down'}
          size={24} 
          color="#aaa" 
        />
      </TouchableOpacity>

      {/* Answer - Conditional render */}
      {expandedFaq === faq.id && (
        <Text style={styles.faqAnswer}>{faq.answer}</Text>
      )}
    </View>
  );

  // ==================== MAIN RENDER ====================
  return (
    <ScrollView style={styles.container}>
      {/* FAQs Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        {faqs.map(renderFaq)}
      </View>

      {/* Contact Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Us</Text>
        
        {/* Email */}
        <TouchableOpacity 
          style={styles.contactItem}
          onPress={() => Linking.openURL('mailto:support@moviego.com')}
        >
          <Ionicons name="mail-outline" size={24} color="#e94560" />
          <Text style={styles.contactText}>support@moviego.com</Text>
        </TouchableOpacity>

        {/* Phone */}
        <TouchableOpacity 
          style={styles.contactItem}
          onPress={() => Linking.openURL('tel:+84123456789')}
        >
          <Ionicons name="call-outline" size={24} color="#e94560" />
          <Text style={styles.contactText}>+84 123 456 789</Text>
        </TouchableOpacity>

        {/* Website */}
        <TouchableOpacity 
          style={styles.contactItem}
          onPress={() => Linking.openURL('https://moviego.com')}
        >
          <Ionicons name="globe-outline" size={24} color="#e94560" />
          <Text style={styles.contactText}>www.moviego.com</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
```

**Accordion Logic:**

```javascript
// State lưu ID của FAQ đang mở
const [expandedFaq, setExpandedFaq] = useState(null);

// Toggle logic
onPress={() => setExpandedFaq(
  expandedFaq === faq.id ? null : faq.id
)}
// Nếu đang mở (expandedFaq === faq.id) → Đóng (set null)
// Nếu đang đóng → Mở (set faq.id)

// Conditional render answer
{expandedFaq === faq.id && (
  <Text>{faq.answer}</Text>
)}
// Chỉ hiện answer nếu FAQ này đang được expand
```

**Linking API - External Actions:**

```javascript
// Open email app
Linking.openURL('mailto:support@moviego.com');

// Make phone call
Linking.openURL('tel:+84123456789');

// Open web browser
Linking.openURL('https://moviego.com');

// Open maps
Linking.openURL('geo:10.0452,105.7469');
```

### 4.3. TermsConditionsScreen - Scrollable Content

```javascript
const TermsConditionsScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Section 1: Introduction */}
        <Text style={styles.title}>Terms and Conditions</Text>
        <Text style={styles.lastUpdated}>Last Updated: November 11, 2025</Text>
        
        <Text style={styles.paragraph}>
          Welcome to MovieGo. These terms and conditions outline the rules 
          and regulations for the use of our mobile application.
        </Text>

        {/* Section 2: Account Terms */}
        <Text style={styles.sectionTitle}>1. Account Terms</Text>
        <Text style={styles.paragraph}>
          • You must be 13 years or older to use this service.{'\n'}
          • You must provide accurate and complete information.{'\n'}
          • You are responsible for maintaining account security.
        </Text>

        {/* Section 3: Booking Terms */}
        <Text style={styles.sectionTitle}>2. Booking Terms</Text>
        <Text style={styles.paragraph}>
          • All bookings are subject to availability.{'\n'}
          • Tickets are non-transferable.{'\n'}
          • Cancellations must be made 2 hours before showtime.
        </Text>

        {/* Section 4: Payment Terms */}
        <Text style={styles.sectionTitle}>3. Payment Terms</Text>
        <Text style={styles.paragraph}>
          • All prices are in USD.{'\n'}
          • Payment is required at the time of booking.{'\n'}
          • Refunds are processed within 5-7 business days.
        </Text>

        {/* Section 5: User Conduct */}
        <Text style={styles.sectionTitle}>4. User Conduct</Text>
        <Text style={styles.paragraph}>
          You agree not to:{'\n'}
          • Use the app for any illegal purpose{'\n'}
          • Share your account credentials{'\n'}
          • Attempt to hack or disrupt the service
        </Text>

        {/* Section 6: Limitation of Liability */}
        <Text style={styles.sectionTitle}>5. Limitation of Liability</Text>
        <Text style={styles.paragraph}>
          MovieGo shall not be liable for any indirect, incidental, 
          special, consequential or punitive damages resulting from 
          your use or inability to use the service.
        </Text>

        {/* Section 7: Changes to Terms */}
        <Text style={styles.sectionTitle}>6. Changes to Terms</Text>
        <Text style={styles.paragraph}>
          We reserve the right to modify these terms at any time. 
          Changes will be effective immediately upon posting.
        </Text>

        {/* Section 8: Contact */}
        <Text style={styles.sectionTitle}>7. Contact Information</Text>
        <Text style={styles.paragraph}>
          For questions about these Terms, please contact us at:{'\n\n'}
          Email: legal@moviego.com{'\n'}
          Phone: +84 123 456 789{'\n'}
          Address: 123 Movie Street, Ho Chi Minh City, Vietnam
        </Text>

        {/* Accept Button */}
        <TouchableOpacity 
          style={styles.acceptButton}
          onPress={() => Alert.alert('Accepted', 'You have accepted the terms')}
        >
          <Text style={styles.acceptButtonText}>I Accept</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
```

**Formatting Text:**

```javascript
// Line breaks với {'\n'}
<Text>Line 1{'\n'}Line 2</Text>

// Bullet points với • character
<Text>
  • Point 1{'\n'}
  • Point 2{'\n'}
  • Point 3
</Text>

// Bold text với nested Text
<Text style={styles.paragraph}>
  This is <Text style={styles.bold}>bold</Text> text.
</Text>
```

---

## 5. TỔNG KẾT - QUY LUẬT THỰC THI

### 5.1. State Update Rules

```javascript
// ✅ ĐÚNG
setState({ ...state, new: 'value' });
setArray([...array, newItem]);

// ❌ SAI
state.property = 'value';
array.push(newItem);
```

### 5.2. Conditional Rendering

```javascript
{condition && <Component />}
{condition ? <A /> : <B />}
{items.map(item => renderItem(item))}
```

### 5.3. Common Mistakes

```javascript
// ❌ Async trong useEffect
useEffect(async () => {...}, []);

// ✅ Đúng cách
useEffect(() => {
  const fetch = async () => {...};
  fetch();
}, []);

// ❌ State không update ngay
setCount(count + 1);
console.log(count); // Giá trị cũ

// ✅ Dùng callback
setCount(prev => prev + 1);
```

---

## 6. BEST PRACTICES

### 6.1. Component Structure

```javascript
// Imports → Hooks → Handlers → Render Helpers → Main Render → Styles → Export
const Component = () => {
  const [state, setState] = useState();
  useEffect(() => {}, []);
  const handlePress = () => {};
  return <View />;
};
export default Component;
```

### 6.2. Performance

```javascript
// Memoize calculations
const value = useMemo(() => calculate(data), [data]);

// Memoize callbacks
const handler = useCallback(() => action(id), [id]);

// Key prop cho lists
{items.map(item => <Item key={item.id} />)}
```

### 6.3. Error Handling

```javascript
// Try-catch cho async
try {
  await operation();
} catch (error) {
  Alert.alert('Error', error.message);
}

// Validation trước save
if (!isValid(data)) return;
await saveData(data);
```

---

## KẾT LUẬN

Tài liệu này giải thích chi tiết:

✅ **Locations (MapScreen)**
- GPS location detection
- Permission handling
- Map integration
- Platform-specific URLs
- Vietnamese cinema data

✅ **Profile (ProfileScreen)**
- Form validation
- Database updates
- Statistics calculation
- Zustand state management
- Navigation

✅ **Support Screens**
- NotificationScreen với switches
- HelpSupportScreen với FAQ accordion
- TermsConditionsScreen với scrollable content
- Linking API cho external actions

**Quy luật thực thi quan trọng:**
1. Component lifecycle: mount → render → update → unmount
2. State updates trigger re-renders
3. useEffect chạy sau render
4. Async operations cần try-catch-finally
5. Validation trước khi save data
6. Immutable state updates

Tất cả code đều follow React best practices và React Native conventions! 🎯
