/**
 * Notification Settings Screen
 * Display and manage notification preferences
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const NotificationScreen = ({ navigation }) => {
  // Notification preferences state
  const [preferences, setPreferences] = useState({
    bookingConfirmation: true,
    movieReminders: true,
    promotions: false,
    newReleases: true,
    systemUpdates: false,
  });

  // Toggle notification preference on/off
  const togglePreference = (key) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Render notification preference item with toggle
  const NotificationItem = ({ icon, title, description, value, onToggle }) => (
    <View style={styles.notificationItem}>
      <View style={styles.itemLeft}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={24} color="#e94560" />
        </View>
        <View style={styles.itemText}>
          <Text style={styles.itemTitle}>{title}</Text>
          <Text style={styles.itemDescription}>{description}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#767577', true: '#e94560' }}
        thumbColor={value ? '#fff' : '#f4f3f4'}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="notifications" size={60} color="#e94560" />
        <Text style={styles.headerTitle}>Notification Settings</Text>
        <Text style={styles.headerSubtitle}>
          Manage your notification preferences
        </Text>
      </View>

      {/* Notification Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Booking Notifications</Text>
        
        <NotificationItem
          icon="ticket"
          title="Booking Confirmations"
          description="Get notified when your booking is confirmed"
          value={preferences.bookingConfirmation}
          onToggle={() => togglePreference('bookingConfirmation')}
        />

        <NotificationItem
          icon="time"
          title="Movie Reminders"
          description="Receive reminders before your showtime"
          value={preferences.movieReminders}
          onToggle={() => togglePreference('movieReminders')}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Marketing Notifications</Text>
        
        <NotificationItem
          icon="pricetag"
          title="Promotions & Offers"
          description="Get exclusive deals and special offers"
          value={preferences.promotions}
          onToggle={() => togglePreference('promotions')}
        />

        <NotificationItem
          icon="film"
          title="New Releases"
          description="Be the first to know about new movies"
          value={preferences.newReleases}
          onToggle={() => togglePreference('newReleases')}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>System Notifications</Text>
        
        <NotificationItem
          icon="refresh"
          title="App Updates"
          description="Get notified about new features and updates"
          value={preferences.systemUpdates}
          onToggle={() => togglePreference('systemUpdates')}
        />
      </View>

      {/* Information Box */}
      <View style={styles.infoBox}>
        <Ionicons name="information-circle" size={24} color="#4caf50" />
        <Text style={styles.infoText}>
          Your notification preferences are saved automatically. You can change them anytime.
        </Text>
      </View>

      {/* Notification History Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Notifications</Text>
        
        <View style={styles.notificationHistory}>
          <View style={styles.historyItem}>
            <Ionicons name="checkmark-circle" size={20} color="#4caf50" />
            <View style={styles.historyContent}>
              <Text style={styles.historyTitle}>Booking Confirmed</Text>
              <Text style={styles.historyTime}>2 hours ago</Text>
            </View>
          </View>

          <View style={styles.historyItem}>
            <Ionicons name="film" size={20} color="#e94560" />
            <View style={styles.historyContent}>
              <Text style={styles.historyTitle}>New Movie Added</Text>
              <Text style={styles.historyTime}>1 day ago</Text>
            </View>
          </View>

          <View style={styles.historyItem}>
            <Ionicons name="pricetag" size={20} color="#ff9800" />
            <View style={styles.historyContent}>
              <Text style={styles.historyTitle}>Special Offer Available</Text>
              <Text style={styles.historyTime}>3 days ago</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Clear All Button */}
      <TouchableOpacity style={styles.clearButton}>
        <Ionicons name="trash-outline" size={20} color="#fff" />
        <Text style={styles.clearButtonText}>Clear All Notifications</Text>
      </TouchableOpacity>

      <View style={{ height: 20 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f3460',
  },
  header: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#16213e',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 15,
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
  },
  section: {
    margin: 15,
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 15,
  },
  iconContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#0f3460',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemText: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 3,
  },
  itemDescription: {
    fontSize: 13,
    color: '#aaa',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#16213e',
    margin: 15,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4caf50',
  },
  infoText: {
    flex: 1,
    color: '#aaa',
    fontSize: 13,
    marginLeft: 10,
    lineHeight: 20,
  },
  notificationHistory: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 15,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1a4d7a',
  },
  historyContent: {
    marginLeft: 12,
    flex: 1,
  },
  historyTitle: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '500',
    marginBottom: 3,
  },
  historyTime: {
    fontSize: 12,
    color: '#aaa',
  },
  clearButton: {
    flexDirection: 'row',
    backgroundColor: '#d32f2f',
    margin: 15,
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default NotificationScreen;
