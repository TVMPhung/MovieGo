import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { movieQueries, showtimeQueries } from '../../database/database';
import { useBookingStore } from '../../store/store';

const MovieDetailsScreen = ({ navigation, route }) => {
  const { movieId } = route.params;
  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);

  const setBookingMovie = useBookingStore((state) => state.setMovie);
  const setBookingDate = useBookingStore((state) => state.setDate);

  useEffect(() => {
    loadMovieDetails();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      loadShowtimesByDate();
    }
  }, [selectedDate]);

  const loadMovieDetails = async () => {
    try {
      setLoading(true);
      const movieData = await movieQueries.getMovieById(movieId);
      const dates = await showtimeQueries.getAvailableDates(movieId);
      
      setMovie(movieData);
      setAvailableDates(dates);
      
      if (dates.length > 0) {
        setSelectedDate(dates[0].show_date);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading movie details:', error);
      Alert.alert('Error', 'Failed to load movie details. Please try again.');
      setLoading(false);
    }
  };

  const loadShowtimesByDate = async () => {
    try {
      const showtimesData = await showtimeQueries.getShowtimesByMovieAndDate(
        movieId,
        selectedDate
      );
      setShowtimes(showtimesData);
    } catch (error) {
      console.error('Error loading showtimes:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const handleShowtimePress = (showtime) => {
    // Save booking info
    setBookingMovie(movie);
    setBookingDate(selectedDate);
    
    // Navigate to booking screen
    navigation.navigate('Booking', { 
      movieId: movie.id,
      showtimeId: showtime.id,
      date: selectedDate
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e94560" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#666" />
        <Text style={styles.errorText}>Movie not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Movie Poster */}
      <Image
        source={{ uri: movie.poster_url }}
        style={styles.posterImage}
        resizeMode="cover"
      />

      {/* Movie Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{movie.title}</Text>
        
        <View style={styles.metaContainer}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={20} color="#ffd700" />
            <Text style={styles.rating}>{movie.rating.toFixed(1)}</Text>
          </View>
          <Text style={styles.metaText}>•</Text>
          <Text style={styles.metaText}>{movie.duration} min</Text>
          <Text style={styles.metaText}>•</Text>
          <Text style={styles.metaText}>{movie.language}</Text>
        </View>

        <View style={styles.genreContainer}>
          {movie.genre.split(',').map((genre, index) => (
            <View key={index} style={styles.genreChip}>
              <Text style={styles.genreText}>{genre.trim()}</Text>
            </View>
          ))}
        </View>

        {/* Synopsis */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Synopsis</Text>
          <Text style={styles.synopsis}>{movie.synopsis}</Text>
        </View>

        {/* Cast & Crew */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Director</Text>
          <Text style={styles.infoText}>{movie.director}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cast</Text>
          <Text style={styles.infoText}>{movie.cast}</Text>
        </View>

        {/* Showtimes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.datesContainer}
          >
            {availableDates.map((dateItem, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dateChip,
                  selectedDate === dateItem.show_date && styles.dateChipActive,
                ]}
                onPress={() => setSelectedDate(dateItem.show_date)}
              >
                <Text
                  style={[
                    styles.dateText,
                    selectedDate === dateItem.show_date && styles.dateTextActive,
                  ]}
                >
                  {formatDate(dateItem.show_date)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Showtimes for selected date */}
        {selectedDate && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Available Showtimes</Text>
            
            {showtimes.length === 0 ? (
              <Text style={styles.noShowtimes}>No showtimes available for this date</Text>
            ) : (
              <View style={styles.showtimesGrid}>
                {showtimes.map((showtime) => (
                  <TouchableOpacity
                    key={showtime.id}
                    style={[
                      styles.showtimeCard,
                      showtime.available_seats === 0 && styles.showtimeCardDisabled,
                    ]}
                    onPress={() => handleShowtimePress(showtime)}
                    disabled={showtime.available_seats === 0}
                  >
                    <Text style={styles.showtimeTime}>{showtime.show_time}</Text>
                    <Text style={styles.showtimeScreen}>Screen {showtime.screen_number}</Text>
                    <Text style={styles.showtimePrice}>${showtime.price.toFixed(2)}</Text>
                    <Text style={styles.showtimeSeats}>
                      {showtime.available_seats > 0
                        ? `${showtime.available_seats} seats`
                        : 'Sold Out'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}
      </View>
    </ScrollView>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f3460',
  },
  errorText: {
    color: '#666',
    fontSize: 18,
    marginTop: 10,
  },
  posterImage: {
    width: '100%',
    height: 400,
  },
  infoContainer: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  rating: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 5,
  },
  metaText: {
    color: '#aaa',
    fontSize: 16,
    marginHorizontal: 8,
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  genreChip: {
    backgroundColor: '#16213e',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  genreText: {
    color: '#e94560',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  synopsis: {
    color: '#ccc',
    fontSize: 15,
    lineHeight: 22,
  },
  infoText: {
    color: '#ccc',
    fontSize: 15,
  },
  datesContainer: {
    marginVertical: 10,
  },
  dateChip: {
    backgroundColor: '#16213e',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#1a4d7a',
  },
  dateChipActive: {
    backgroundColor: '#e94560',
    borderColor: '#e94560',
  },
  dateText: {
    color: '#aaa',
    fontSize: 14,
    fontWeight: '600',
  },
  dateTextActive: {
    color: '#fff',
  },
  noShowtimes: {
    color: '#666',
    fontSize: 15,
    textAlign: 'center',
    paddingVertical: 20,
  },
  showtimesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  showtimeCard: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 15,
    marginRight: 10,
    marginBottom: 10,
    minWidth: '45%',
    borderWidth: 1,
    borderColor: '#1a4d7a',
  },
  showtimeCardDisabled: {
    opacity: 0.5,
  },
  showtimeTime: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  showtimeScreen: {
    color: '#aaa',
    fontSize: 13,
    marginBottom: 5,
  },
  showtimePrice: {
    color: '#e94560',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  showtimeSeats: {
    color: '#aaa',
    fontSize: 12,
  },
});

export default MovieDetailsScreen;
