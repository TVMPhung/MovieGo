import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { movieQueries } from '../../database/database';

const MoviesListScreen = ({ navigation }) => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [loading, setLoading] = useState(true);

  const genres = ['All', 'Action', 'Drama', 'Sci-Fi', 'Thriller', 'Adventure', 'Crime'];

  useEffect(() => {
    loadMovies();
  }, []);

  useEffect(() => {
    filterMovies();
  }, [searchQuery, selectedGenre, movies]);

  const loadMovies = async () => {
    try {
      setLoading(true);
      const moviesData = await movieQueries.getAllMovies();
      setMovies(moviesData);
      setFilteredMovies(moviesData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading movies:', error);
      Alert.alert('Error', 'Failed to load movies. Please try again.');
      setLoading(false);
    }
  };

  const filterMovies = () => {
    let filtered = [...movies];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (movie) =>
          movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          movie.genre.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by genre
    if (selectedGenre !== 'All') {
      filtered = filtered.filter((movie) =>
        movie.genre.includes(selectedGenre)
      );
    }

    setFilteredMovies(filtered);
  };

  const handleMoviePress = (movie) => {
    navigation.navigate('MovieDetails', { movieId: movie.id });
  };

  const renderMovieCard = ({ item }) => (
    <TouchableOpacity
      style={styles.movieCard}
      onPress={() => handleMoviePress(item)}
    >
      <Image
        source={{ uri: item.poster_url }}
        style={styles.poster}
        resizeMode="cover"
      />
      <View style={styles.movieInfo}>
        <Text style={styles.movieTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.movieGenre} numberOfLines={1}>
          {item.genre}
        </Text>
        <View style={styles.movieMeta}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#ffd700" />
            <Text style={styles.rating}>{item.rating.toFixed(1)}</Text>
          </View>
          <Text style={styles.duration}>{item.duration} min</Text>
        </View>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => handleMoviePress(item)}
        >
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderGenreFilter = () => (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={genres}
      keyExtractor={(item) => item}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[
            styles.genreChip,
            selectedGenre === item && styles.genreChipActive,
          ]}
          onPress={() => setSelectedGenre(item)}
        >
          <Text
            style={[
              styles.genreText,
              selectedGenre === item && styles.genreTextActive,
            ]}
          >
            {item}
          </Text>
        </TouchableOpacity>
      )}
      contentContainerStyle={styles.genreList}
    />
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e94560" />
        <Text style={styles.loadingText}>Loading movies...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#aaa" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search movies..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#aaa" />
          </TouchableOpacity>
        )}
      </View>

      {/* Genre Filter */}
      {renderGenreFilter()}

      {/* Movies List */}
      {filteredMovies.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="film-outline" size={64} color="#666" />
          <Text style={styles.emptyText}>No movies found</Text>
        </View>
      ) : (
        <FlatList
          data={filteredMovies}
          renderItem={renderMovieCard}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.moviesList}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16213e',
    margin: 15,
    marginBottom: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1a4d7a',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    paddingVertical: 12,
  },
  genreList: {
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  genreChip: {
    backgroundColor: '#16213e',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#1a4d7a',
  },
  genreChipActive: {
    backgroundColor: '#e94560',
    borderColor: '#e94560',
  },
  genreText: {
    color: '#aaa',
    fontSize: 14,
    fontWeight: '600',
  },
  genreTextActive: {
    color: '#fff',
  },
  moviesList: {
    padding: 15,
  },
  movieCard: {
    flexDirection: 'row',
    backgroundColor: '#16213e',
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  poster: {
    width: 120,
    height: 180,
  },
  movieInfo: {
    flex: 1,
    padding: 15,
  },
  movieTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  movieGenre: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 10,
  },
  movieMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  rating: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 5,
    fontWeight: '600',
  },
  duration: {
    color: '#aaa',
    fontSize: 14,
  },
  bookButton: {
    backgroundColor: '#e94560',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
    marginTop: 'auto',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    color: '#666',
    fontSize: 18,
    marginTop: 10,
  },
});

export default MoviesListScreen;
