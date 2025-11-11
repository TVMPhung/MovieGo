import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import bcrypt from 'bcryptjs';
import { userQueries } from '../../database/database';
import { validateFullName, validatePhone, validateEmail, validatePassword, validatePasswordMatch } from '../../utils/validation';

// Set random fallback for React Native
bcrypt.setRandomFallback((len) => {
  const buf = new Uint8Array(len);
  return buf.map(() => Math.floor(Math.random() * 256));
});

const SignUpScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Validation errors
  const [fullNameError, setFullNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  // Validate full name on change
  const handleFullNameChange = (text) => {
    setFullName(text);
    const validation = validateFullName(text);
    setFullNameError(validation.error);
  };

  // Validate phone on change
  const handlePhoneChange = (text) => {
    setPhone(text);
    const validation = validatePhone(text, true); // Phone is optional
    setPhoneError(validation.error);
  };

  // Validate email on change
  const handleEmailChange = (text) => {
    setEmail(text);
    const validation = validateEmail(text);
    setEmailError(validation.error);
  };

  // Validate password on change
  const handlePasswordChange = (text) => {
    setPassword(text);
    const validation = validatePassword(text);
    setPasswordError(validation.error);
    
    // Also check if passwords match if confirm password is filled
    if (confirmPassword) {
      const matchValidation = validatePasswordMatch(text, confirmPassword);
      setConfirmPasswordError(matchValidation.error);
    }
  };

  // Validate confirm password on change
  const handleConfirmPasswordChange = (text) => {
    setConfirmPassword(text);
    const validation = validatePasswordMatch(password, text);
    setConfirmPasswordError(validation.error);
  };

  const handleSignUp = async () => {
    // Run all validations
    const fullNameValidation = validateFullName(fullName);
    const emailValidation = validateEmail(email);
    const phoneValidation = validatePhone(phone, true); // Optional
    const passwordValidation = validatePassword(password);
    const passwordMatchValidation = validatePasswordMatch(password, confirmPassword);

    // Update error states
    setFullNameError(fullNameValidation.error);
    setEmailError(emailValidation.error);
    setPhoneError(phoneValidation.error);
    setPasswordError(passwordValidation.error);
    setConfirmPasswordError(passwordMatchValidation.error);

    // Check if all validations passed
    if (!fullNameValidation.isValid || !emailValidation.isValid || 
        !phoneValidation.isValid || !passwordValidation.isValid || 
        !passwordMatchValidation.isValid) {
      Alert.alert('Validation Error', 'Please fix the errors before submitting');
      return;
    }

    setLoading(true);

    try {
      // Check if user already exists
      const existingUser = await userQueries.getUserByEmail(email.toLowerCase().trim());

      if (existingUser) {
        Alert.alert('Error', 'An account with this email already exists');
        setLoading(false);
        return;
      }

      // Hash password - use hashSync for React Native compatibility
      const saltRounds = 10;
      const hashedPassword = bcrypt.hashSync(password.trim(), saltRounds);

      // Create user
      await userQueries.createUser(
        email.toLowerCase().trim(),
        hashedPassword,
        fullName.trim()
      );

      // Update phone if provided
      if (phone) {
        const user = await userQueries.getUserByEmail(email.toLowerCase().trim());
        const cleanPhone = phone.replace(/[\s\-()]/g, ''); // Clean phone number
        await userQueries.updateUser(user.id, fullName.trim(), cleanPhone, '');
      }

      setLoading(false);

      Alert.alert(
        'Success',
        'Account created successfully! Please login.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Sign up error:', error);
      Alert.alert('Error', 'An error occurred during registration. Please try again.');
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
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join MovieGo today</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={[styles.input, fullNameError && styles.inputError]}
              placeholder="Enter your full name"
              placeholderTextColor="#666"
              value={fullName}
              onChangeText={handleFullNameChange}
              autoCapitalize="words"
            />
            {fullNameError ? (
              <Text style={styles.errorText}>{fullNameError}</Text>
            ) : null}

            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={[styles.input, emailError && styles.inputError]}
              placeholder="Enter your email"
              placeholderTextColor="#666"
              value={email}
              onChangeText={handleEmailChange}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {emailError ? (
              <Text style={styles.errorText}>{emailError}</Text>
            ) : null}

            <Text style={styles.label}>Phone (Optional)</Text>
            <TextInput
              style={[styles.input, phoneError && styles.inputError]}
              placeholder="Enter your phone number (10 digits)"
              placeholderTextColor="#666"
              value={phone}
              onChangeText={handlePhoneChange}
              keyboardType="phone-pad"
              maxLength={15}
            />
            {phoneError ? (
              <Text style={styles.errorText}>{phoneError}</Text>
            ) : null}

            <Text style={styles.label}>Password *</Text>
            <TextInput
              style={[styles.input, passwordError && styles.inputError]}
              placeholder="Enter your password (min. 6 characters)"
              placeholderTextColor="#666"
              value={password}
              onChangeText={handlePasswordChange}
              secureTextEntry
              autoCapitalize="none"
            />
            {passwordError ? (
              <Text style={styles.errorText}>{passwordError}</Text>
            ) : null}

            <Text style={styles.label}>Confirm Password *</Text>
            <TextInput
              style={[styles.input, confirmPasswordError && styles.inputError]}
              placeholder="Re-enter your password"
              placeholderTextColor="#666"
              value={confirmPassword}
              onChangeText={handleConfirmPasswordChange}
              secureTextEntry
              autoCapitalize="none"
            />
            {confirmPasswordError ? (
              <Text style={styles.errorText}>{confirmPasswordError}</Text>
            ) : null}

            <TouchableOpacity
              style={styles.signupButton}
              onPress={handleSignUp}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.signupButtonText}>Sign Up</Text>
              )}
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.loginLink}>Login</Text>
              </TouchableOpacity>
            </View>
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
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
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
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#0f3460',
    color: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 5,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#1a4d7a',
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
  signupButton: {
    backgroundColor: '#e94560',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    color: '#aaa',
    fontSize: 14,
  },
  loginLink: {
    color: '#e94560',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default SignUpScreen;
