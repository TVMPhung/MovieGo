/**
 * MEMBER 2: Booking Screen
 * Multi-step booking flow: Date → Movie → Showtime → Seat Selection
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { seatQueries, showtimeQueries, movieQueries } from '../../database/database';
import { useBookingStore } from '../../store/store';

const BookingScreen = ({ navigation, route }) => {
  const { movieId, showtimeId, date } = route.params;
  
  const [movie, setMovie] = useState(null);
  const [showtime, setShowtime] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  const setBookingSeats = useBookingStore((state) => state.setSeats);
  const setBookingShowtime = useBookingStore((state) => state.setShowtime);

  useEffect(() => {
    loadBookingData();
  }, []);

  const loadBookingData = async () => {
    try {
      setLoading(true);
      const movieData = await movieQueries.getMovieById(movieId);
      const showtimeData = await showtimeQueries.getShowtimeById(showtimeId);
      const seatsData = await seatQueries.getSeatsByShowtime(showtimeId);
      
      setMovie(movieData);
      setShowtime(showtimeData);
      setSeats(seatsData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading booking data:', error);
      Alert.alert('Error', 'Failed to load booking information. Please try again.');
      setLoading(false);
    }
  };

  const handleSeatPress = (seat) => {
    if (!seat.is_available) {
      Alert.alert('Unavailable', 'This seat is already booked.');
      return;
    }

    const isSelected = selectedSeats.find((s) => s.id === seat.id);

    if (isSelected) {
      // Deselect seat
      setSelectedSeats(selectedSeats.filter((s) => s.id !== seat.id));
    } else {
      // Select seat (max 10 seats)
      if (selectedSeats.length >= 10) {
        Alert.alert('Limit Reached', 'You can select maximum 10 seats at a time.');
        return;
      }
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const handleProceedToPayment = () => {
    if (selectedSeats.length === 0) {
      Alert.alert('No Seats Selected', 'Please select at least one seat.');
      return;
    }

    // Calculate total amount
    const totalAmount = selectedSeats.length * showtime.price;

    // Save booking info
    setBookingSeats(selectedSeats, totalAmount);
    setBookingShowtime(showtime);

    // Navigate to payment
    navigation.navigate('Payment', {
      movieId,
      showtimeId,
      seatIds: selectedSeats.map((s) => s.id),
      totalAmount,
    });
  };

  const getSeatColor = (seat) => {
    const isSelected = selectedSeats.find((s) => s.id === seat.id);
    if (isSelected) return '#e94560';
    if (!seat.is_available) return '#666';
    return '#16213e';
  };

  const renderSeatGrid = () => {
    const rows = [...new Set(seats.map((s) => s.seat_row))].sort();
    
    return (
      <View style={styles.seatGrid}>
        {/* Screen */}
        <View style={styles.screenContainer}>
          <View style={styles.screen} />
          <Text style={styles.screenText}>SCREEN</Text>
        </View>

        {/* Seats */}
        {rows.map((row) => {
          const rowSeats = seats.filter((s) => s.seat_row === row).sort((a, b) => a.seat_number - b.seat_number);
          
          return (
            <View key={row} style={styles.seatRow}>
              <Text style={styles.rowLabel}>{row}</Text>
              <View style={styles.seatsContainer}>
                {rowSeats.map((seat) => {
                  const isSelected = selectedSeats.find((s) => s.id === seat.id);
                  
                  return (
                    <TouchableOpacity
                      key={seat.id}
                      style={[
                        styles.seat,
                        { backgroundColor: getSeatColor(seat) },
                        isSelected && styles.seatSelected,
                      ]}
                      onPress={() => handleSeatPress(seat)}
                      disabled={!seat.is_available}
                    >
                      <Text style={styles.seatNumber}>{seat.seat_number}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e94560" />
        <Text style={styles.loadingText}>Loading seats...</Text>
      </View>
    );
  }

  const totalAmount = selectedSeats.length * showtime.price;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Booking Info */}
        <View style={styles.infoCard}>
          <Text style={styles.movieTitle}>{movie.title}</Text>
          <Text style={styles.infoText}>
            {date} • {showtime.show_time} • Screen {showtime.screen_number}
          </Text>
        </View>

        {/* Seat Legend */}
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendSeat, { backgroundColor: '#16213e' }]} />
            <Text style={styles.legendText}>Available</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendSeat, { backgroundColor: '#e94560' }]} />
            <Text style={styles.legendText}>Selected</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendSeat, { backgroundColor: '#666' }]} />
            <Text style={styles.legendText}>Booked</Text>
          </View>
        </View>

        {/* Seat Grid */}
        {renderSeatGrid()}
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryLabel}>Selected Seats:</Text>
          <Text style={styles.summaryValue}>
            {selectedSeats.length > 0
              ? selectedSeats.map((s) => `${s.seat_row}${s.seat_number}`).join(', ')
              : 'None'}
          </Text>
          <Text style={styles.summaryLabel}>Total Amount:</Text>
          <Text style={styles.totalAmount}>${totalAmount.toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.proceedButton,
            selectedSeats.length === 0 && styles.proceedButtonDisabled,
          ]}
          onPress={handleProceedToPayment}
          disabled={selectedSeats.length === 0}
        >
          <Text style={styles.proceedButtonText}>Proceed to Payment</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
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
  infoCard: {
    backgroundColor: '#16213e',
    margin: 15,
    padding: 15,
    borderRadius: 10,
  },
  movieTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  infoText: {
    color: '#aaa',
    fontSize: 14,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendSeat: {
    width: 20,
    height: 20,
    borderRadius: 5,
    marginRight: 5,
  },
  legendText: {
    color: '#aaa',
    fontSize: 12,
  },
  seatGrid: {
    padding: 15,
  },
  screenContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  screen: {
    width: '80%',
    height: 5,
    backgroundColor: '#e94560',
    borderRadius: 50,
    marginBottom: 5,
  },
  screenText: {
    color: '#aaa',
    fontSize: 12,
  },
  seatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  rowLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    width: 30,
  },
  seatsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  seat: {
    width: 30,
    height: 30,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
  },
  seatSelected: {
    borderWidth: 2,
    borderColor: '#fff',
  },
  seatNumber: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  bottomBar: {
    backgroundColor: '#16213e',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#1a4d7a',
  },
  summaryContainer: {
    marginBottom: 15,
  },
  summaryLabel: {
    color: '#aaa',
    fontSize: 13,
    marginBottom: 3,
  },
  summaryValue: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 10,
  },
  totalAmount: {
    color: '#e94560',
    fontSize: 24,
    fontWeight: 'bold',
  },
  proceedButton: {
    backgroundColor: '#e94560',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  proceedButtonDisabled: {
    backgroundColor: '#666',
  },
  proceedButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
});

export default BookingScreen;
