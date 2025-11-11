import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { bookingQueries } from '../../database/database';
import { CommonActions } from '@react-navigation/native';

const BookingConfirmationScreen = ({ navigation, route }) => {
  const { bookingId, bookingRef, transactionId } = route.params;
  
  const [booking, setBooking] = useState(null);
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookingDetails();
  }, []);

  const loadBookingDetails = async () => {
    try {
      const bookingData = await bookingQueries.getBookingById(bookingId);
      const seatsData = await bookingQueries.getBookingSeats(bookingId);
      
      setBooking(bookingData);
      setSeats(seatsData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading booking details:', error);
      setLoading(false);
    }
  };

  const handleDone = () => {
    // Reset navigation stack and go to Movies tab
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'MoviesTab' }],
      })
    );
  };

  const handleViewTickets = () => {
    // Navigate to ticket history
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'HistoryTab' }],
      })
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e94560" />
        <Text style={styles.loadingText}>Loading booking details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Success Icon */}
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={80} color="#4caf50" />
          </View>
          <Text style={styles.successTitle}>Booking Confirmed!</Text>
          <Text style={styles.successMessage}>
            Your tickets have been booked successfully
          </Text>
        </View>

        {/* Booking Reference */}
        <View style={styles.referenceCard}>
          <Text style={styles.referenceLabel}>Booking Reference</Text>
          <Text style={styles.referenceValue}>{bookingRef}</Text>
          <Text style={styles.referenceNote}>
            Please show this reference at the cinema
          </Text>
        </View>

        {/* Booking Details */}
        <View style={styles.detailsCard}>
          <Text style={styles.cardTitle}>Booking Details</Text>
          
          <View style={styles.detailRow}>
            <Ionicons name="film" size={20} color="#e94560" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Movie</Text>
              <Text style={styles.detailValue}>{booking?.movie_title}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="calendar" size={20} color="#e94560" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Date & Time</Text>
              <Text style={styles.detailValue}>
                {booking?.show_date} • {booking?.show_time}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="location" size={20} color="#e94560" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Screen</Text>
              <Text style={styles.detailValue}>Screen {booking?.screen_number}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="ticket" size={20} color="#e94560" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Seats</Text>
              <Text style={styles.detailValue}>
                {seats.map((s) => `${s.seat_row}${s.seat_number}`).join(', ')}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="people" size={20} color="#e94560" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Number of Tickets</Text>
              <Text style={styles.detailValue}>{booking?.total_seats}</Text>
            </View>
          </View>
        </View>

        {/* Payment Details */}
        <View style={styles.detailsCard}>
          <Text style={styles.cardTitle}>Payment Details</Text>
          
          <View style={styles.detailRow}>
            <Ionicons name="card" size={20} color="#e94560" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Transaction ID</Text>
              <Text style={styles.detailValue}>{transactionId}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="cash" size={20} color="#e94560" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Amount Paid</Text>
              <Text style={styles.amountValue}>${booking?.total_amount.toFixed(2)}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="checkmark-done" size={20} color="#4caf50" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Payment Status</Text>
              <Text style={[styles.detailValue, styles.paidStatus]}>Paid</Text>
            </View>
          </View>
        </View>

        {/* Note */}
        <View style={styles.noteCard}>
          <Ionicons name="information-circle" size={24} color="#e94560" />
          <Text style={styles.noteText}>
            Please arrive at least 15 minutes before the showtime. Carry a valid ID for verification.
          </Text>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.secondaryButton} onPress={handleViewTickets}>
          <Text style={styles.secondaryButtonText}>View My Tickets</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryButton} onPress={handleDone}>
          <Text style={styles.primaryButtonText}>Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f3460',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f3460',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  successContainer: {
    alignItems: 'center',
    padding: 30,
  },
  successIcon: {
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  successMessage: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
  },
  referenceCard: {
    backgroundColor: '#16213e',
    margin: 15,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e94560',
  },
  referenceLabel: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 8,
  },
  referenceValue: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  referenceNote: {
    color: '#aaa',
    fontSize: 12,
    textAlign: 'center',
  },
  detailsCard: {
    backgroundColor: '#16213e',
    margin: 15,
    marginTop: 0,
    padding: 15,
    borderRadius: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  detailContent: {
    flex: 1,
    marginLeft: 15,
  },
  detailLabel: {
    color: '#aaa',
    fontSize: 13,
    marginBottom: 3,
  },
  detailValue: {
    color: '#fff',
    fontSize: 15,
  },
  amountValue: {
    color: '#e94560',
    fontSize: 20,
    fontWeight: 'bold',
  },
  paidStatus: {
    color: '#4caf50',
    fontWeight: 'bold',
  },
  noteCard: {
    flexDirection: 'row',
    backgroundColor: '#16213e',
    margin: 15,
    marginTop: 0,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1a4d7a',
  },
  noteText: {
    flex: 1,
    color: '#aaa',
    fontSize: 13,
    marginLeft: 10,
    lineHeight: 20,
  },
  bottomBar: {
    flexDirection: 'row',
    backgroundColor: '#16213e',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#1a4d7a',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#0f3460',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e94560',
  },
  secondaryButtonText: {
    color: '#e94560',
    fontSize: 16,
    fontWeight: 'bold',
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#e94560',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BookingConfirmationScreen;
