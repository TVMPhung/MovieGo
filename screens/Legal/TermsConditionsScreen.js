/**
 * Terms & Conditions Screen
 * Display legal terms and conditions for the application
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TermsConditionsScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="document-text" size={60} color="#e94560" />
        <Text style={styles.headerTitle}>Terms & Conditions</Text>
        <Text style={styles.headerSubtitle}>
          Last updated: November 11, 2025
        </Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Section 1 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Introduction</Text>
          <Text style={styles.paragraph}>
            Welcome to MovieGo. These Terms and Conditions govern your use of our mobile application and services. By accessing or using MovieGo, you agree to be bound by these terms.
          </Text>
        </View>

        {/* Section 2 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. User Account</Text>
          <Text style={styles.paragraph}>
            To use our services, you must create an account. You are responsible for:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Maintaining the confidentiality of your account credentials</Text>
            <Text style={styles.bulletItem}>• All activities that occur under your account</Text>
            <Text style={styles.bulletItem}>• Providing accurate and current information</Text>
            <Text style={styles.bulletItem}>• Notifying us immediately of any unauthorized access</Text>
          </View>
        </View>

        {/* Section 3 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Booking and Payment</Text>
          <Text style={styles.paragraph}>
            When you book tickets through MovieGo:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• All bookings are subject to availability</Text>
            <Text style={styles.bulletItem}>• Payment must be completed at the time of booking</Text>
            <Text style={styles.bulletItem}>• Ticket prices are subject to change without notice</Text>
            <Text style={styles.bulletItem}>• Promotional codes are subject to terms and validity periods</Text>
          </View>
        </View>

        {/* Section 4 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Cancellation and Refund Policy</Text>
          <Text style={styles.paragraph}>
            Our cancellation policy is as follows:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Cancellations must be made at least 2 hours before showtime</Text>
            <Text style={styles.bulletItem}>• Full refunds are issued for timely cancellations</Text>
            <Text style={styles.bulletItem}>• Late cancellations or no-shows are non-refundable</Text>
            <Text style={styles.bulletItem}>• Refunds are processed within 5-7 business days</Text>
          </View>
        </View>

        {/* Section 5 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. User Conduct</Text>
          <Text style={styles.paragraph}>
            You agree not to:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Use the service for any illegal purposes</Text>
            <Text style={styles.bulletItem}>• Attempt to gain unauthorized access to our systems</Text>
            <Text style={styles.bulletItem}>• Interfere with or disrupt the service</Text>
            <Text style={styles.bulletItem}>• Use automated systems to book tickets (bots)</Text>
            <Text style={styles.bulletItem}>• Resell tickets at inflated prices</Text>
          </View>
        </View>

        {/* Section 6 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Privacy and Data Protection</Text>
          <Text style={styles.paragraph}>
            We take your privacy seriously. Our Privacy Policy explains how we collect, use, and protect your personal information. By using MovieGo, you consent to our data practices as described in our Privacy Policy.
          </Text>
        </View>

        {/* Section 7 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Intellectual Property</Text>
          <Text style={styles.paragraph}>
            All content, trademarks, and data on this application, including but not limited to software, databases, text, graphics, icons, and hyperlinks, are the property of or licensed to MovieGo and are protected by law.
          </Text>
        </View>

        {/* Section 8 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Limitation of Liability</Text>
          <Text style={styles.paragraph}>
            MovieGo shall not be liable for:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Any indirect, incidental, or consequential damages</Text>
            <Text style={styles.bulletItem}>• Loss of profits, data, or business opportunities</Text>
            <Text style={styles.bulletItem}>• Service interruptions or technical issues</Text>
            <Text style={styles.bulletItem}>• Content or conduct of third parties</Text>
          </View>
        </View>

        {/* Section 9 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. Cinema Rules</Text>
          <Text style={styles.paragraph}>
            When attending our cinemas, you must follow all cinema rules and regulations, including but not limited to:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• No outside food or beverages</Text>
            <Text style={styles.bulletItem}>• No recording or photography during screenings</Text>
            <Text style={styles.bulletItem}>• Respectful behavior towards other guests and staff</Text>
            <Text style={styles.bulletItem}>• Compliance with age restrictions</Text>
          </View>
        </View>

        {/* Section 10 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>10. Modifications to Terms</Text>
          <Text style={styles.paragraph}>
            We reserve the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting. Your continued use of the service constitutes acceptance of the modified terms.
          </Text>
        </View>

        {/* Section 11 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>11. Termination</Text>
          <Text style={styles.paragraph}>
            We may terminate or suspend your account and access to the service immediately, without prior notice, for any breach of these Terms and Conditions.
          </Text>
        </View>

        {/* Section 12 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>12. Governing Law</Text>
          <Text style={styles.paragraph}>
            These Terms and Conditions are governed by and construed in accordance with the laws of the jurisdiction in which MovieGo operates, without regard to its conflict of law provisions.
          </Text>
        </View>

        {/* Contact Section */}
        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>Questions?</Text>
          <Text style={styles.contactText}>
            If you have any questions about these Terms and Conditions, please contact us:
          </Text>
          <View style={styles.contactDetails}>
            <View style={styles.contactItem}>
              <Ionicons name="mail" size={18} color="#e94560" />
              <Text style={styles.contactItemText}>legal@moviego.com</Text>
            </View>
            <View style={styles.contactItem}>
              <Ionicons name="call" size={18} color="#e94560" />
              <Text style={styles.contactItemText}>+1 (555) 123-4567</Text>
            </View>
            <View style={styles.contactItem}>
              <Ionicons name="globe" size={18} color="#e94560" />
              <Text style={styles.contactItemText}>www.moviego.com</Text>
            </View>
          </View>
        </View>

        {/* Acceptance Note */}
        <View style={styles.acceptanceNote}>
          <Ionicons name="checkmark-circle" size={24} color="#4caf50" />
          <Text style={styles.acceptanceText}>
            By using MovieGo, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
          </Text>
        </View>
      </View>

      <View style={{ height: 30 }} />
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
    fontSize: 13,
    color: '#aaa',
    textAlign: 'center',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e94560',
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 22,
    textAlign: 'justify',
  },
  bulletList: {
    marginTop: 10,
    marginLeft: 5,
  },
  bulletItem: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 24,
    marginBottom: 5,
  },
  contactSection: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  contactText: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 15,
    lineHeight: 20,
  },
  contactDetails: {
    marginTop: 10,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  contactItemText: {
    fontSize: 14,
    color: '#aaa',
    marginLeft: 12,
  },
  acceptanceNote: {
    flexDirection: 'row',
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#4caf50',
  },
  acceptanceText: {
    flex: 1,
    fontSize: 13,
    color: '#aaa',
    marginLeft: 12,
    lineHeight: 20,
  },
});

export default TermsConditionsScreen;
