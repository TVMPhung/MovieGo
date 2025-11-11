/**
 * Change Password Screen
 * Allows user to update their password
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import bcrypt from 'bcryptjs';
import { useAuthStore } from '../../store/store';
import { userQueries } from '../../database/database';
import { validatePassword, validatePasswordMatch } from '../../utils/validation';

// Set random fallback for React Native
bcrypt.setRandomFallback((len) => {
  const buf = new Uint8Array(len);
  return buf.map(() => Math.floor(Math.random() * 256));
});

const ChangePasswordScreen = ({ navigation }) => {
  const user = useAuthStore((state) => state.user);
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Password visibility toggles
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Validation errors
  const [currentPasswordError, setCurrentPasswordError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  // Validate current password on input change
  const handleCurrentPasswordChange = (text) => {
    setCurrentPassword(text);
    if (text.length === 0) {
      setCurrentPasswordError('Current password is required');
    } else {
      setCurrentPasswordError('');
    }
  };

  // Validate new password and check match with confirm
  const handleNewPasswordChange = (text) => {
    setNewPassword(text);
    const validation = validatePassword(text);
    setNewPasswordError(validation.error);
    
    // Also check if passwords match if confirm password is filled
    if (confirmPassword) {
      const matchValidation = validatePasswordMatch(text, confirmPassword);
      setConfirmPasswordError(matchValidation.error);
    }
  };

  // Validate confirm password matches new password
  const handleConfirmPasswordChange = (text) => {
    setConfirmPassword(text);
    const validation = validatePasswordMatch(newPassword, text);
    setConfirmPasswordError(validation.error);
  };

  // Validate, verify current password, and save new password
  const handleChangePassword = async () => {
    // Validate all fields
    let hasErrors = false;

    if (!currentPassword) {
      setCurrentPasswordError('Current password is required');
      hasErrors = true;
    }

    const newPasswordValidation = validatePassword(newPassword);
    setNewPasswordError(newPasswordValidation.error);
    if (!newPasswordValidation.isValid) {
      hasErrors = true;
    }

    const matchValidation = validatePasswordMatch(newPassword, confirmPassword);
    setConfirmPasswordError(matchValidation.error);
    if (!matchValidation.isValid) {
      hasErrors = true;
    }

    if (hasErrors) {
      Alert.alert('Validation Error', 'Please fix the errors before submitting');
      return;
    }

    // Check if new password is same as current
    if (currentPassword === newPassword) {
      Alert.alert('Error', 'New password must be different from current password');
      return;
    }

    setLoading(true);

    try {
      // Get user from database to verify current password
      const dbUser = await userQueries.getUserById(user.id);

      if (!dbUser) {
        Alert.alert('Error', 'User not found. Please try logging in again.');
        setLoading(false);
        return;
      }

      // Verify current password
      const isPasswordCorrect = bcrypt.compareSync(currentPassword, dbUser.password);

      if (!isPasswordCorrect) {
        Alert.alert('Error', 'Current password is incorrect');
        setCurrentPasswordError('Incorrect password');
        setLoading(false);
        return;
      }

      // Hash new password
      const saltRounds = 10;
      const hashedPassword = bcrypt.hashSync(newPassword, saltRounds);

      // Update password in database
      await userQueries.updatePassword(user.id, hashedPassword);

      setLoading(false);

      Alert.alert(
        'Success',
        'Password changed successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );

      // Clear form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Change password error:', error);
      Alert.alert('Error', 'Failed to change password. Please try again.');
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Ionicons name="lock-closed" size={60} color="#e94560" />
            <Text style={styles.title}>Change Password</Text>
            <Text style={styles.subtitle}>Keep your account secure</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Current Password */}
            <Text style={styles.label}>Current Password *</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[
                  styles.passwordInput,
                  currentPasswordError && styles.inputError,
                ]}
                placeholder="Enter current password"
                placeholderTextColor="#666"
                value={currentPassword}
                onChangeText={handleCurrentPasswordChange}
                secureTextEntry={!showCurrentPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                <Ionicons
                  name={showCurrentPassword ? 'eye-off' : 'eye'}
                  size={24}
                  color="#aaa"
                />
              </TouchableOpacity>
            </View>
            {currentPasswordError ? (
              <Text style={styles.errorText}>{currentPasswordError}</Text>
            ) : null}

            {/* New Password */}
            <Text style={styles.label}>New Password *</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[
                  styles.passwordInput,
                  newPasswordError && styles.inputError,
                ]}
                placeholder="Enter new password (min. 6 characters)"
                placeholderTextColor="#666"
                value={newPassword}
                onChangeText={handleNewPasswordChange}
                secureTextEntry={!showNewPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowNewPassword(!showNewPassword)}
              >
                <Ionicons
                  name={showNewPassword ? 'eye-off' : 'eye'}
                  size={24}
                  color="#aaa"
                />
              </TouchableOpacity>
            </View>
            {newPasswordError ? (
              <Text style={styles.errorText}>{newPasswordError}</Text>
            ) : null}

            {/* Confirm Password */}
            <Text style={styles.label}>Confirm New Password *</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[
                  styles.passwordInput,
                  confirmPasswordError && styles.inputError,
                ]}
                placeholder="Re-enter new password"
                placeholderTextColor="#666"
                value={confirmPassword}
                onChangeText={handleConfirmPasswordChange}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons
                  name={showConfirmPassword ? 'eye-off' : 'eye'}
                  size={24}
                  color="#aaa"
                />
              </TouchableOpacity>
            </View>
            {confirmPasswordError ? (
              <Text style={styles.errorText}>{confirmPasswordError}</Text>
            ) : null}

            {/* Password Requirements */}
            <View style={styles.requirementsBox}>
              <Text style={styles.requirementsTitle}>Password Requirements:</Text>
              <Text style={styles.requirementText}>• At least 6 characters long</Text>
              <Text style={styles.requirementText}>• Different from current password</Text>
            </View>

            {/* Buttons */}
            <TouchableOpacity
              style={styles.changeButton}
              onPress={handleChangePassword}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={24} color="#fff" />
                  <Text style={styles.changeButtonText}>Change Password</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f3460',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 15,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#aaa',
  },
  form: {
    backgroundColor: '#16213e',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
    marginTop: 10,
    fontWeight: '600',
  },
  passwordContainer: {
    position: 'relative',
    marginBottom: 5,
  },
  passwordInput: {
    backgroundColor: '#0f3460',
    color: '#fff',
    borderRadius: 10,
    padding: 15,
    paddingRight: 50,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#1a4d7a',
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  inputError: {
    borderColor: '#e94560',
    borderWidth: 2,
  },
  errorText: {
    color: '#e94560',
    fontSize: 12,
    marginBottom: 10,
    marginTop: 2,
  },
  requirementsBox: {
    backgroundColor: '#0f3460',
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#1a4d7a',
  },
  requirementsTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  requirementText: {
    color: '#aaa',
    fontSize: 13,
    marginBottom: 4,
  },
  changeButton: {
    backgroundColor: '#e94560',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  changeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#1a4d7a',
  },
  cancelButtonText: {
    color: '#aaa',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ChangePasswordScreen;
