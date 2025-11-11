import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useAuthStore } from '../../store/store';
import { bookingQueries } from '../../database/database';

const TicketHistoryScreen = ({ navigation }) => {
  const user = useAuthStore((state) => state.user);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all'); // all, upcoming, past

  useFocusEffect(
    useCallback(() => {
      loadBookings();
    }, [])
  );

  const loadBookings = async () => {
    try {
      setLoading(true);
      const bookingsData = await bookingQueries.getUserBookings(user.id);
      setBookings(bookingsData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading bookings:', error);
      Alert.alert('Error', 'Failed to load booking history. Please try again.');
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBookings();
    setRefreshing(false);
  };

  const getFilteredBookings = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return bookings.filter((booking) => {
      const bookingDate = new Date(booking.show_date);
      
      if (filter === 'upcoming') {
        return bookingDate >= today;
      } else if (filter === 'past') {
        return bookingDate < today;
      }
      return true; // all
    });
  };

  const handleBookingPress = async (booking) => {
    try {
      const seats = await bookingQueries.getBookingSeats(booking.id);
      
      Alert.alert(
        'Booking Details',
        `Movie: ${booking.movie_title}\n` +
        `Date: ${booking.show_date}\n` +
        `Time: ${booking.show_time}\n` +
        `Screen: ${booking.screen_number}\n` +
        `Seats: ${seats.map((s) => `${s.seat_row}${s.seat_number}`).join(', ')}\n` +
        `Total: $${booking.total_amount.toFixed(2)}\n` +
        `Status: ${booking.payment_status}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error loading booking details:', error);
      Alert.alert('Error', 'Failed to load booking details.');
    }
  };

  const getStatusColor = (booking) => {
    const bookingDate = new Date(booking.show_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (bookingDate < today) {
      return '#666'; // Past
    }
    return '#4caf50'; // Upcoming
  };

  const getStatusText = (booking) => {
    const bookingDate = new Date(booking.show_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (bookingDate < today) {
      return 'Completed';
    }
    return 'Upcoming';
  };

  const renderBookingCard = ({ item }) => (
    <TouchableOpacity
      style={styles.bookingCard}
      onPress={() => handleBookingPress(item)}
    >
      <Image
        source={{ uri: item.poster_url }}
        style={styles.poster}
        resizeMode="cover"
      />
      <View style={styles.bookingInfo}>
        <Text style={styles.movieTitle} numberOfLines={2}>
          {item.movie_title}
        </Text>
        <Text style={styles.genre} numberOfLines={1}>
          {item.genre}
        </Text>
        
        <View style={styles.detailRow}>
          <Ionicons name="calendar" size={14} color="#aaa" />
          <Text style={styles.detailText}>
            {item.show_date} • {item.show_time}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="location" size={14} color="#aaa" />
          <Text style={styles.detailText}>Screen {item.screen_number}</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="ticket" size={14} color="#aaa" />
          <Text style={styles.detailText}>{item.total_seats} Ticket(s)</Text>
        </View>

        <View style={styles.bottomRow}>
          <Text style={styles.amount}>${item.total_amount.toFixed(2)}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item) }]}>
            <Text style={styles.statusText}>{getStatusText(item)}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFilters = () => (
    <View style={styles.filterContainer}>
      <TouchableOpacity
        style={[styles.filterChip, filter === 'all' && styles.filterChipActive]}
        onPress={() => setFilter('all')}
      >
        <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
          All
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.filterChip, filter === 'upcoming' && styles.filterChipActive]}
        onPress={() => setFilter('upcoming')}
      >
        <Text style={[styles.filterText, filter === 'upcoming' && styles.filterTextActive]}>
          Upcoming
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.filterChip, filter === 'past' && styles.filterChipActive]}
        onPress={() => setFilter('past')}
      >
        <Text style={[styles.filterText, filter === 'past' && styles.filterTextActive]}>
          Past
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="ticket-outline" size={64} color="#666" />
      <Text style={styles.emptyText}>No bookings found</Text>
      <Text style={styles.emptySubtext}>
        {filter === 'upcoming'
          ? "You don't have any upcoming bookings"
          : filter === 'past'
          ? "You don't have any past bookings"
          : 'Start booking your favorite movies!'}
      </Text>
      {filter === 'all' && (
        <TouchableOpacity
          style={styles.browseButton}
          onPress={() => navigation.navigate('MoviesTab')}
        >
          <Text style={styles.browseButtonText}>Browse Movies</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e94560" />
        <Text style={styles.loadingText}>Loading bookings...</Text>
      </View>
    );
  }

  const filteredBookings = getFilteredBookings();

  return (
    <View style={styles.container}>
      {renderFilters()}
      
      <FlatList
        data={filteredBookings}
        renderItem={renderBookingCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={[
          styles.listContent,
          filteredBookings.length === 0 && styles.listContentEmpty,
        ]}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#e94560"
            colors={['#e94560']}
          />
        }
      />
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
  filterContainer: {
    flexDirection: 'row',
    padding: 15,
    paddingBottom: 10,
  },
  filterChip: {
    backgroundColor: '#16213e',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#1a4d7a',
  },
  filterChipActive: {
    backgroundColor: '#e94560',
    borderColor: '#e94560',
  },
  filterText: {
    color: '#aaa',
    fontSize: 14,
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#fff',
  },
  listContent: {
    padding: 15,
  },
  listContentEmpty: {
    flexGrow: 1,
  },
  bookingCard: {
    flexDirection: 'row',
    backgroundColor: '#16213e',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  poster: {
    width: 100,
    height: 150,
  },
  bookingInfo: {
    flex: 1,
    padding: 12,
  },
  movieTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  genre: {
    color: '#aaa',
    fontSize: 12,
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    color: '#aaa',
    fontSize: 13,
    marginLeft: 6,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  amount: {
    color: '#e94560',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  emptySubtext: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 20,
  },
  browseButton: {
    backgroundColor: '#e94560',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 20,
  },
  browseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TicketHistoryScreen;
