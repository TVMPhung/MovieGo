/**
 * MEMBER 4: Map Screen
 * Shows cinema/store locations on a map
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

const MapScreen = ({ navigation }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  // Request location permission on component mount
  useEffect(() => {
    requestLocationPermission();
  }, []);

  // Request location permission from user
  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === 'granted');
      
      if (status === 'granted') {
        // Optionally get location immediately
        // await getCurrentLocation();
      } else {
        console.log('Location permission denied');
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
      setLocationPermission(false);
    }
  };

  // Get user's current GPS location
  const getCurrentLocation = async () => {
    setLoadingLocation(true);
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Yêu cầu quyền truy cập vị trí',
          'Vui lòng bật dịch vụ vị trí để sử dụng chỉ đường từ vị trí hiện tại của bạn.',
          [
            { text: 'Hủy', style: 'cancel' },
            { text: 'Mở Cài đặt', onPress: () => Linking.openSettings() },
          ]
        );
        setLoadingLocation(false);
        return null;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeout: 10000,
        maximumAge: 60000, // Cache for 1 minute
      });

      const userLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
      };

      setCurrentLocation(userLocation);
      setLoadingLocation(false);
      return userLocation;
    } catch (error) {
      setLoadingLocation(false);
      console.error('Error getting current location:', error);
      
      Alert.alert(
        'Lỗi vị trí',
        'Không thể lấy vị trí hiện tại của bạn. Vui lòng kiểm tra xem dịch vụ vị trí đã được bật chưa.',
        [{ text: 'OK' }]
      );
      return null;
    }
  };

  // Cinema locations data - Vietnamese locations
  const cinemaLocations = [
    {
      id: 1,
      name: 'MovieGo Cinema Saigon Center',
      address: '65 Lê Lợi, Phường Bến Nghé, Quận 1',
      city: 'Hồ Chí Minh',
      phone: '+84 28 3822 5678',
      latitude: 10.7733,
      longitude: 106.7010,
      screens: 8,
      parking: 'Bãi đậu xe có sẵn',
      facilities: ['IMAX', '3D', 'Dolby Atmos', 'VIP Lounge'],
    },
    {
      id: 2,
      name: 'MovieGo Cinema Vincom Center',
      address: '72 Lê Thánh Tôn, Phường Bến Nghé, Quận 1',
      city: 'Hồ Chí Minh',
      phone: '+84 28 3936 9999',
      latitude: 10.7771,
      longitude: 106.7020,
      screens: 12,
      parking: 'Bãi đậu xe ngầm',
      facilities: ['IMAX', '4DX', 'Dolby Atmos', 'Khu ẩm thực'],
    },
    {
      id: 3,
      name: 'MovieGo Cinema Landmark 81',
      address: '720A Điện Biên Phủ, Phường 22, Quận Bình Thạnh',
      city: 'Hồ Chí Minh',
      phone: '+84 28 3622 6888',
      latitude: 10.7946,
      longitude: 106.7217,
      screens: 10,
      parking: 'Bãi đậu xe nhiều tầng',
      facilities: ['IMAX', '3D', 'Premium Seating', 'Nhà hàng'],
    },
    {
      id: 4,
      name: 'MovieGo Cinema Hà Nội',
      address: '191 Bà Triệu, Phường Lê Đại Hành, Quận Hai Bà Trưng',
      city: 'Hà Nội',
      phone: '+84 24 3974 3333',
      latitude: 21.0136,
      longitude: 105.8474,
      screens: 9,
      parking: 'Bãi đậu xe ngoài trời',
      facilities: ['3D', 'Dolby Atmos', 'Quán café', 'VIP Lounge'],
    },
    {
      id: 5,
      name: 'MovieGo Cinema Đà Nẵng',
      address: '255-257 Hùng Vương, Phường Vĩnh Trung, Quận Thanh Khê',
      city: 'Đà Nẵng',
      phone: '+84 236 3656 999',
      latitude: 16.0678,
      longitude: 108.2068,
      screens: 7,
      parking: 'Bãi đậu xe có sẵn',
      facilities: ['3D', 'Dolby Atmos', 'Quán ăn nhanh'],
    },
    {
      id: 6,
      name: 'MovieGo Cinema Cần Thơ',
      address: '209 Đường 30 Tháng 4, Phường Xuân Khánh, Quận Ninh Kiều',
      city: 'Cần Thơ',
      phone: '+84 292 3812 345',
      latitude: 10.0452,
      longitude: 105.7469,
      screens: 8,
      parking: 'Bãi đậu xe rộng rãi',
      facilities: ['IMAX', '3D', 'Dolby Atmos', 'Khu vui chơi trẻ em'],
    },
  ];

  // Open cinema location in device's native maps app
  const openInMaps = (location) => {
    const { latitude, longitude, name } = location;
    const url = Platform.select({
      ios: `maps:0,0?q=${name}@${latitude},${longitude}`,
      android: `geo:0,0?q=${latitude},${longitude}(${name})`,
    });
    
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        // Fallback to Google Maps web
        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
        Linking.openURL(googleMapsUrl);
      }
    });
  };

  // Open phone app to call cinema
  const callCinema = (phone) => {
    const phoneUrl = `tel:${phone}`;
    Linking.canOpenURL(phoneUrl).then((supported) => {
      if (supported) {
        Linking.openURL(phoneUrl);
      } else {
        Alert.alert('Error', 'Cannot make phone call on this device');
      }
    });
  };

  // Render expandable cinema location card
  const renderLocationCard = (location) => (
    <TouchableOpacity
      key={location.id}
      style={[
        styles.locationCard,
        selectedLocation?.id === location.id && styles.locationCardSelected,
      ]}
      onPress={() => setSelectedLocation(location)}
    >
      <View style={styles.locationHeader}>
        <View style={styles.locationIconContainer}>
          <Ionicons name="location" size={28} color="#e94560" />
        </View>
        <View style={styles.locationInfo}>
          <Text style={styles.locationName}>{location.name}</Text>
          <Text style={styles.locationCity}>{location.city}</Text>
        </View>
      </View>

      <View style={styles.locationDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="pin" size={16} color="#aaa" />
          <Text style={styles.detailText}>{location.address}</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="call" size={16} color="#aaa" />
          <Text style={styles.detailText}>{location.phone}</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="film" size={16} color="#aaa" />
          <Text style={styles.detailText}>{location.screens} Screens</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="car" size={16} color="#aaa" />
          <Text style={styles.detailText}>{location.parking}</Text>
        </View>
      </View>

      {selectedLocation?.id === location.id && (
        <View style={styles.expandedSection}>
          <Text style={styles.facilitiesTitle}>Facilities:</Text>
          <View style={styles.facilitiesContainer}>
            {location.facilities.map((facility, index) => (
              <View key={index} style={styles.facilityChip}>
                <Text style={styles.facilityText}>{facility}</Text>
              </View>
            ))}
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => openInMaps(location)}
            >
              <Ionicons name="navigate" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Directions</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.callButton]}
              onPress={() => callCinema(location.phone)}
            >
              <Ionicons name="call" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Call</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cinema Locations</Text>
        <Text style={styles.headerSubtitle}>
          Tìm rạp chiếu phim MovieGo gần bạn
        </Text>
      </View>

      {/* Map Placeholder */}
      <View style={styles.mapPlaceholder}>
        <Ionicons name="map" size={64} color="#e94560" />
        <Text style={styles.mapPlaceholderText}>
          Interactive Map View
        </Text>
        <Text style={styles.mapPlaceholderSubtext}>
          Tap on a location below to see details
        </Text>
      </View>

      {/* Locations List */}
      <ScrollView style={styles.locationsList}>
        <Text style={styles.sectionTitle}>
          All Locations ({cinemaLocations.length})
        </Text>
        {cinemaLocations.map(renderLocationCard)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f3460',
  },
  header: {
    padding: 20,
    paddingTop: 15,
    backgroundColor: '#16213e',
    borderBottomWidth: 1,
    borderBottomColor: '#1a4d7a',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#aaa',
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: '#16213e',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#1a4d7a',
    borderStyle: 'dashed',
  },
  mapPlaceholderText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
  },
  mapPlaceholderSubtext: {
    color: '#aaa',
    fontSize: 13,
    marginTop: 5,
  },
  locationsList: {
    flex: 1,
    padding: 15,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  locationCard: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#16213e',
  },
  locationCardSelected: {
    borderColor: '#e94560',
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  locationIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#0f3460',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 3,
  },
  locationCity: {
    fontSize: 14,
    color: '#aaa',
  },
  locationDetails: {
    marginLeft: 62,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    color: '#ccc',
    fontSize: 14,
    marginLeft: 10,
    flex: 1,
  },
  expandedSection: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#1a4d7a',
  },
  facilitiesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  facilitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  facilityChip: {
    backgroundColor: '#0f3460',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#1a4d7a',
  },
  facilityText: {
    color: '#e94560',
    fontSize: 12,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#e94560',
    borderRadius: 8,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  callButton: {
    backgroundColor: '#4caf50',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default MapScreen;
