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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MapScreen = ({ navigation }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Cinema locations data
  const cinemaLocations = [
    {
      id: 1,
      name: 'MovieGo Cinema Downtown',
      address: '123 Main Street, Downtown',
      city: 'City Center',
      phone: '+1 (555) 123-4567',
      latitude: 40.7128,
      longitude: -74.0060,
      screens: 8,
      parking: 'Available',
      facilities: ['IMAX', '3D', 'Dolby Atmos', 'VIP Lounge'],
    },
    {
      id: 2,
      name: 'MovieGo Cinema Mall',
      address: '456 Shopping Mall Blvd',
      city: 'West Side',
      phone: '+1 (555) 234-5678',
      latitude: 40.7580,
      longitude: -73.9855,
      screens: 12,
      parking: 'Underground Parking',
      facilities: ['IMAX', '4DX', 'Dolby Atmos', 'Food Court'],
    },
    {
      id: 3,
      name: 'MovieGo Cinema Plaza',
      address: '789 Entertainment Plaza',
      city: 'East District',
      phone: '+1 (555) 345-6789',
      latitude: 40.7489,
      longitude: -73.9680,
      screens: 6,
      parking: 'Street Parking',
      facilities: ['3D', 'Dolby Atmos', 'Cafe'],
    },
    {
      id: 4,
      name: 'MovieGo Cinema Park',
      address: '321 Park Avenue',
      city: 'North Side',
      phone: '+1 (555) 456-7890',
      latitude: 40.7829,
      longitude: -73.9654,
      screens: 10,
      parking: 'Multi-level Parking',
      facilities: ['IMAX', '3D', 'Premium Seating', 'Restaurant'],
    },
  ];

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
          Find a MovieGo cinema near you
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
