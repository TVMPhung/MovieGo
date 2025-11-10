/**
 * MEMBER 3: Payment Screen
 * Handles mock payment processing and booking confirmation
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { bookingQueries, paymentQueries } from '../../database/database';
import { useAuthStore, useBookingStore } from '../../store/store';

const PaymentScreen = ({ navigation, route }) => {
  const { movieId, showtimeId, seatIds, totalAmount } = route.params;
  
  const user = useAuthStore((state) => state.user);
  const selectedMovie = useBookingStore((state) => state.selectedMovie);
  const selectedShowtime = useBookingStore((state) => state.selectedShowtime);
  const selectedSeats = useBookingStore((state) => state.selectedSeats);
  const clearBooking = useBookingStore((state) => state.clearBooking);
  
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [processing, setProcessing] = useState(false);

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: 'card' },
    { id: 'wallet', name: 'Digital Wallet', icon: 'wallet' },
    { id: 'upi', name: 'UPI', icon: 'phone-portrait' },
  ];

  const validateCardNumber = (number) => {
    // Simple validation: 16 digits
    const cleaned = number.replace(/\s/g, '');
    return cleaned.length === 16 && /^\d+$/.test(cleaned);
  };

  const validateExpiryDate = (date) => {
    // Format: MM/YY
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    return regex.test(date);
  };

  const validateCVV = (cvv) => {
    return cvv.length === 3 && /^\d+$/.test(cvv);
  };

  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.substring(0, 19); // 16 digits + 3 spaces
  };

  const formatExpiryDate = (text) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
    }
    return cleaned;
  };

  const handlePayment = async () => {
    // Validation
    if (paymentMethod === 'card') {
      if (!cardName || !cardNumber || !expiryDate || !cvv) {
        Alert.alert('Error', 'Please fill in all card details');
        return;
      }

      if (!validateCardNumber(cardNumber)) {
        Alert.alert('Error', 'Please enter a valid 16-digit card number');
        return;
      }

      if (!validateExpiryDate(expiryDate)) {
        Alert.alert('Error', 'Please enter a valid expiry date (MM/YY)');
        return;
      }

      if (!validateCVV(cvv)) {
        Alert.alert('Error', 'Please enter a valid 3-digit CVV');
        return;
      }
    }

    setProcessing(true);

    try {
      // Simulate payment processing delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create booking in database
      const { bookingId, bookingRef } = await bookingQueries.createBooking(
        user.id,
        movieId,
        showtimeId,
        seatIds.length,
        totalAmount,
        seatIds
      );

      // Create payment record
      const { transactionId } = await paymentQueries.createPayment(
        bookingId,
        totalAmount,
        paymentMethod
      );

      setProcessing(false);

      // Clear booking state
      clearBooking();

      // Navigate to confirmation
      navigation.navigate('BookingConfirmation', {
        bookingId,
        bookingRef,
        transactionId,
      });
    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert('Error', 'Payment failed. Please try again.');
      setProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Booking Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Booking Summary</Text>
          <View style={styles.summaryCard}>
            <Text style={styles.movieTitle}>{selectedMovie?.title}</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Date & Time:</Text>
              <Text style={styles.summaryValue}>
                {selectedShowtime?.show_date} • {selectedShowtime?.show_time}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Screen:</Text>
              <Text style={styles.summaryValue}>Screen {selectedShowtime?.screen_number}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Seats:</Text>
              <Text style={styles.summaryValue}>
                {selectedSeats.map((s) => `${s.seat_row}${s.seat_number}`).join(', ')}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Number of Tickets:</Text>
              <Text style={styles.summaryValue}>{seatIds.length}</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total Amount:</Text>
              <Text style={styles.totalValue}>${totalAmount.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Payment Method Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentMethodCard,
                paymentMethod === method.id && styles.paymentMethodCardActive,
              ]}
              onPress={() => setPaymentMethod(method.id)}
            >
              <Ionicons
                name={method.icon}
                size={24}
                color={paymentMethod === method.id ? '#e94560' : '#aaa'}
              />
              <Text
                style={[
                  styles.paymentMethodText,
                  paymentMethod === method.id && styles.paymentMethodTextActive,
                ]}
              >
                {method.name}
              </Text>
              {paymentMethod === method.id && (
                <Ionicons name="checkmark-circle" size={24} color="#e94560" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Card Details (if card payment selected) */}
        {paymentMethod === 'card' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Card Details</Text>
            <View style={styles.formCard}>
              <Text style={styles.label}>Cardholder Name</Text>
              <TextInput
                style={styles.input}
                placeholder="John Doe"
                placeholderTextColor="#666"
                value={cardName}
                onChangeText={setCardName}
                autoCapitalize="words"
              />

              <Text style={styles.label}>Card Number</Text>
              <TextInput
                style={styles.input}
                placeholder="1234 5678 9012 3456"
                placeholderTextColor="#666"
                value={cardNumber}
                onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                keyboardType="numeric"
                maxLength={19}
              />

              <View style={styles.row}>
                <View style={styles.halfInput}>
                  <Text style={styles.label}>Expiry Date</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="MM/YY"
                    placeholderTextColor="#666"
                    value={expiryDate}
                    onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
                    keyboardType="numeric"
                    maxLength={5}
                  />
                </View>
                <View style={styles.halfInput}>
                  <Text style={styles.label}>CVV</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="123"
                    placeholderTextColor="#666"
                    value={cvv}
                    onChangeText={setCvv}
                    keyboardType="numeric"
                    maxLength={3}
                    secureTextEntry
                  />
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Demo Notice */}
        {paymentMethod !== 'card' && (
          <View style={styles.demoNotice}>
            <Ionicons name="information-circle" size={20} color="#e94560" />
            <Text style={styles.demoText}>
              This is a demo payment. No actual transaction will be made.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Pay Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.payButton}
          onPress={handlePayment}
          disabled={processing}
        >
          {processing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.payButtonText}>Pay ${totalAmount.toFixed(2)}</Text>
              <Ionicons name="lock-closed" size={20} color="#fff" />
            </>
          )}
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
  content: {
    flex: 1,
  },
  section: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  summaryCard: {
    backgroundColor: '#16213e',
    borderRadius: 10,
    padding: 15,
  },
  movieTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    color: '#aaa',
    fontSize: 14,
  },
  summaryValue: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
    textAlign: 'right',
  },
  totalRow: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#1a4d7a',
  },
  totalLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalValue: {
    color: '#e94560',
    fontSize: 20,
    fontWeight: 'bold',
  },
  paymentMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16213e',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#16213e',
  },
  paymentMethodCardActive: {
    borderColor: '#e94560',
  },
  paymentMethodText: {
    flex: 1,
    color: '#aaa',
    fontSize: 16,
    marginLeft: 15,
  },
  paymentMethodTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  formCard: {
    backgroundColor: '#16213e',
    borderRadius: 10,
    padding: 15,
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
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#1a4d7a',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    flex: 1,
    marginRight: 10,
  },
  demoNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16213e',
    margin: 15,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e94560',
  },
  demoText: {
    color: '#aaa',
    fontSize: 14,
    marginLeft: 10,
    flex: 1,
  },
  bottomBar: {
    backgroundColor: '#16213e',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#1a4d7a',
  },
  payButton: {
    backgroundColor: '#e94560',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
});

export default PaymentScreen;
