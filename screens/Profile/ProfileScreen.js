import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/store';
import { userQueries, bookingQueries } from '../../database/database';
import { validateFullName, validatePhone } from '../../utils/validation';

const ProfileScreen = ({ navigation }) => {
  const user = useAuthStore((state) => state.user);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const logout = useAuthStore((state) => state.logout);

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [loading, setLoading] = useState(false);
  
  // Statistics state
  const [stats, setStats] = useState({
    totalBookings: 0,
    moviesWatched: 0,
    totalSpent: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);
  
  // Validation errors
  const [fullNameError, setFullNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // Sync form fields with user data on mount
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
      loadAccountStatistics();
    }
  }, [user]);

  // Load account statistics from database
  const loadAccountStatistics = async () => {
    if (!user?.id) return;
    
    setLoadingStats(true);
    try {
      // Get all bookings for the user
      const bookings = await bookingQueries.getUserBookings(user.id);
      
      if (bookings && bookings.length > 0) {
        // Calculate total bookings
        const totalBookings = bookings.length;
        
        // Calculate unique movies watched (using Set to avoid duplicates)
        const uniqueMovies = new Set(bookings.map(booking => booking.movie_id));
        const moviesWatched = uniqueMovies.size;
        
        // Calculate total spent
        const totalSpent = bookings.reduce((sum, booking) => sum + booking.total_amount, 0);
        
        setStats({
          totalBookings,
          moviesWatched,
          totalSpent: totalSpent.toFixed(2),
        });
      } else {
        setStats({
          totalBookings: 0,
          moviesWatched: 0,
          totalSpent: '0.00',
        });
      }
    } catch (error) {
      console.error('Error loading statistics:', error);
      setStats({
        totalBookings: 0,
        moviesWatched: 0,
        totalSpent: '0.00',
      });
    } finally {
      setLoadingStats(false);
    }
  };

  // Validate full name with real-time feedback
  const handleFullNameChange = (text) => {
    setFullName(text);
    if (isEditing) {
      const validation = validateFullName(text);
      setFullNameError(validation.error);
    }
  };

  // Validate phone number with real-time feedback
  const handlePhoneChange = (text) => {
    setPhone(text);
    if (isEditing) {
      const validation = validatePhone(text, true); // Phone is optional
      setPhoneError(validation.error);
    }
  };

  // Validate and save profile changes to database
  const handleSave = async () => {
    // Run validations
    const fullNameValidation = validateFullName(fullName);
    const phoneValidation = validatePhone(phone, true); // Optional

    // Update error states
    setFullNameError(fullNameValidation.error);
    setPhoneError(phoneValidation.error);

    // Check if validations passed
    if (!fullNameValidation.isValid || !phoneValidation.isValid) {
      Alert.alert('Validation Error', 'Please fix the errors before saving');
      return;
    }

    setLoading(true);

    try {
      // Clean phone number (remove spaces, hyphens, parentheses)
      const cleanPhone = phone ? phone.replace(/[\s\-()]/g, '') : '';
      
      // Update in database
      await userQueries.updateUser(
        user.id,
        fullName.trim(),
        cleanPhone,
        address.trim()
      );

      // Update in state
      updateProfile({
        fullName: fullName.trim(),
        phone: cleanPhone,
        address: address.trim(),
      });

      setLoading(false);
      setIsEditing(false);
      setFullNameError('');
      setPhoneError('');
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
      setLoading(false);
    }
  };

  // Discard changes and restore original values
  const handleCancel = () => {
    // Reset to original values
    setFullName(user.fullName || '');
    setPhone(user.phone || '');
    setAddress(user.address || '');
    setFullNameError('');
    setPhoneError('');
    setIsEditing(false);
  };

  // Confirm and execute logout
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => logout(),
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person" size={50} color="#fff" />
        </View>
        <Text style={styles.emailText}>{user?.email}</Text>
      </View>

      {/* Profile Form */}
      <View style={styles.formCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Personal Information</Text>
          {!isEditing && (
            <TouchableOpacity onPress={() => setIsEditing(true)}>
              <Ionicons name="create-outline" size={24} color="#e94560" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={[
              styles.input, 
              !isEditing && styles.inputDisabled,
              fullNameError && isEditing && styles.inputError
            ]}
            value={fullName}
            onChangeText={handleFullNameChange}
            placeholder="Enter your full name"
            placeholderTextColor="#666"
            editable={isEditing}
            autoCapitalize="words"
          />
          {fullNameError && isEditing ? (
            <Text style={styles.errorText}>{fullNameError}</Text>
          ) : null}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, styles.inputDisabled]}
            value={user?.email}
            editable={false}
            placeholderTextColor="#666"
          />
          <Text style={styles.helperText}>Email cannot be changed</Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={[
              styles.input, 
              !isEditing && styles.inputDisabled,
              phoneError && isEditing && styles.inputError
            ]}
            value={phone}
            onChangeText={handlePhoneChange}
            placeholder="Enter your phone number (10 digits)"
            placeholderTextColor="#666"
            editable={isEditing}
            keyboardType="phone-pad"
            maxLength={15}
          />
          {phoneError && isEditing ? (
            <Text style={styles.errorText}>{phoneError}</Text>
          ) : null}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={[
              styles.input,
              styles.textArea,
              !isEditing && styles.inputDisabled,
            ]}
            value={address}
            onChangeText={setAddress}
            placeholder="Enter your address"
            placeholderTextColor="#666"
            editable={isEditing}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Action Buttons */}
        {isEditing && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Account Statistics */}
      <View style={styles.statsCard}>
        <Text style={styles.cardTitle}>Account Statistics</Text>
        {loadingStats ? (
          <ActivityIndicator size="large" color="#e94560" style={{ marginTop: 20 }} />
        ) : (
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Ionicons name="ticket" size={32} color="#e94560" />
              <Text style={styles.statLabel}>Total Bookings</Text>
              <Text style={styles.statValue}>{stats.totalBookings}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="film" size={32} color="#e94560" />
              <Text style={styles.statLabel}>Movies Watched</Text>
              <Text style={styles.statValue}>{stats.moviesWatched}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="cash" size={32} color="#e94560" />
              <Text style={styles.statLabel}>Total Spent</Text>
              <Text style={styles.statValue}>${stats.totalSpent}</Text>
            </View>
          </View>
        )}
      </View>

      {/* Settings Section */}
      <View style={styles.settingsCard}>
        <Text style={styles.cardTitle}>Settings</Text>
        
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Ionicons name="notifications-outline" size={24} color="#aaa" />
          <Text style={styles.settingText}>Notifications</Text>
          <Ionicons name="chevron-forward" size={24} color="#aaa" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.settingItem}
          onPress={() => navigation.navigate('ChangePassword')}
        >
          <Ionicons name="lock-closed-outline" size={24} color="#aaa" />
          <Text style={styles.settingText}>Change Password</Text>
          <Ionicons name="chevron-forward" size={24} color="#aaa" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.settingItem}
          onPress={() => navigation.navigate('HelpSupport')}
        >
          <Ionicons name="help-circle-outline" size={24} color="#aaa" />
          <Text style={styles.settingText}>Help & Support</Text>
          <Ionicons name="chevron-forward" size={24} color="#aaa" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.settingItem}
          onPress={() => navigation.navigate('TermsConditions')}
        >
          <Ionicons name="document-text-outline" size={24} color="#aaa" />
          <Text style={styles.settingText}>Terms & Conditions</Text>
          <Ionicons name="chevron-forward" size={24} color="#aaa" />
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color="#fff" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* App Version */}
      <Text style={styles.versionText}>MovieGo v1.0.0</Text>
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
    paddingVertical: 30,
    backgroundColor: '#16213e',
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e94560',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  emailText: {
    color: '#aaa',
    fontSize: 16,
  },
  formCard: {
    backgroundColor: '#16213e',
    margin: 15,
    padding: 20,
    borderRadius: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#0f3460',
    color: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#1a4d7a',
  },
  inputDisabled: {
    backgroundColor: '#1a1a2e',
    color: '#aaa',
  },
  inputError: {
    borderColor: '#e94560',
    borderWidth: 2,
  },
  errorText: {
    color: '#e94560',
    fontSize: 12,
    marginTop: 5,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  helperText: {
    color: '#666',
    fontSize: 12,
    marginTop: 5,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#0f3460',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#1a4d7a',
  },
  cancelButtonText: {
    color: '#aaa',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#e94560',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statsCard: {
    backgroundColor: '#16213e',
    margin: 15,
    marginTop: 0,
    padding: 20,
    borderRadius: 10,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  statValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
  settingsCard: {
    backgroundColor: '#16213e',
    margin: 15,
    marginTop: 0,
    padding: 20,
    borderRadius: 10,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#1a4d7a',
  },
  settingText: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    marginLeft: 15,
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#d32f2f',
    margin: 15,
    marginTop: 0,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  versionText: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    paddingVertical: 20,
  },
});

export default ProfileScreen;
