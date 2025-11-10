/**
 * Help & Support Screen
 * Provide assistance and support resources for users
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HelpSupportScreen = ({ navigation }) => {
  const [expandedFaq, setExpandedFaq] = useState(null);

  // FAQ Data
  const faqs = [
    {
      id: 1,
      question: 'How do I book tickets?',
      answer: 'Browse movies, select your showtime, choose your seats, and proceed to payment. Your tickets will be confirmed once payment is complete.',
    },
    {
      id: 2,
      question: 'Can I cancel or modify my booking?',
      answer: 'You can view your bookings in the "My Tickets" tab. Cancellations must be made at least 2 hours before showtime for a full refund.',
    },
    {
      id: 3,
      question: 'What payment methods are accepted?',
      answer: 'We accept credit cards, debit cards, and mobile payment methods. All transactions are secure and encrypted.',
    },
    {
      id: 4,
      question: 'How do I use my tickets at the cinema?',
      answer: 'Show your digital ticket (with QR code) from the app at the cinema entrance. Staff will scan it for entry.',
    },
    {
      id: 5,
      question: 'What if I forget my password?',
      answer: 'Use the "Forgot Password" link on the login screen to reset your password via email.',
    },
    {
      id: 6,
      question: 'Are there any discounts available?',
      answer: 'Check the Promotions section for current offers. Students and seniors may qualify for special discounts.',
    },
  ];

  // Contact methods
  const contactMethods = [
    {
      id: 1,
      icon: 'mail',
      title: 'Email Support',
      subtitle: 'support@moviego.com',
      action: () => handleEmail(),
      color: '#4caf50',
    },
    {
      id: 2,
      icon: 'call',
      title: 'Phone Support',
      subtitle: '+1 (555) 123-4567',
      action: () => handleCall(),
      color: '#2196f3',
    },
    {
      id: 3,
      icon: 'chatbubbles',
      title: 'Live Chat',
      subtitle: 'Available 9 AM - 9 PM',
      action: () => navigation.navigate('ChatTab'),
      color: '#ff9800',
    },
    {
      id: 4,
      icon: 'globe',
      title: 'Visit Website',
      subtitle: 'www.moviego.com',
      action: () => handleWebsite(),
      color: '#9c27b0',
    },
  ];

  const handleEmail = () => {
    Linking.openURL('mailto:support@moviego.com?subject=MovieGo Support Request');
  };

  const handleCall = () => {
    Linking.openURL('tel:+15551234567');
  };

  const handleWebsite = () => {
    Linking.openURL('https://www.moviego.com');
  };

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="help-circle" size={60} color="#e94560" />
        <Text style={styles.headerTitle}>Help & Support</Text>
        <Text style={styles.headerSubtitle}>
          We're here to help you 24/7
        </Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Us</Text>
        <View style={styles.contactGrid}>
          {contactMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={styles.contactCard}
              onPress={method.action}
            >
              <View style={[styles.contactIcon, { backgroundColor: method.color }]}>
                <Ionicons name={method.icon} size={28} color="#fff" />
              </View>
              <Text style={styles.contactTitle}>{method.title}</Text>
              <Text style={styles.contactSubtitle}>{method.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* FAQ Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        
        {faqs.map((faq) => (
          <TouchableOpacity
            key={faq.id}
            style={styles.faqItem}
            onPress={() => toggleFaq(faq.id)}
          >
            <View style={styles.faqHeader}>
              <Text style={styles.faqQuestion}>{faq.question}</Text>
              <Ionicons
                name={expandedFaq === faq.id ? 'chevron-up' : 'chevron-down'}
                size={24}
                color="#aaa"
              />
            </View>
            {expandedFaq === faq.id && (
              <Text style={styles.faqAnswer}>{faq.answer}</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Quick Tips */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Tips</Text>
        
        <View style={styles.tipsContainer}>
          <View style={styles.tipItem}>
            <View style={styles.tipIcon}>
              <Ionicons name="bulb" size={24} color="#ffd700" />
            </View>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Book Early</Text>
              <Text style={styles.tipText}>
                Book your tickets in advance to get the best seats
              </Text>
            </View>
          </View>

          <View style={styles.tipItem}>
            <View style={styles.tipIcon}>
              <Ionicons name="notifications" size={24} color="#4caf50" />
            </View>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Enable Notifications</Text>
              <Text style={styles.tipText}>
                Get reminders before your showtime
              </Text>
            </View>
          </View>

          <View style={styles.tipItem}>
            <View style={styles.tipIcon}>
              <Ionicons name="wallet" size={24} color="#2196f3" />
            </View>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Check for Offers</Text>
              <Text style={styles.tipText}>
                Look out for special promotions and discounts
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Support Hours */}
      <View style={styles.infoBox}>
        <Ionicons name="time" size={24} color="#4caf50" />
        <View style={styles.infoContent}>
          <Text style={styles.infoTitle}>Support Hours</Text>
          <Text style={styles.infoText}>
            Our support team is available Monday to Sunday, 9:00 AM - 9:00 PM EST
          </Text>
        </View>
      </View>

      {/* Report Issue Button */}
      <TouchableOpacity style={styles.reportButton}>
        <Ionicons name="flag" size={20} color="#fff" />
        <Text style={styles.reportButtonText}>Report an Issue</Text>
      </TouchableOpacity>

      <View style={{ height: 20 }} />
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
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
  },
  section: {
    margin: 15,
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  contactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  contactCard: {
    width: '48%',
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  contactIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
    textAlign: 'center',
  },
  contactSubtitle: {
    fontSize: 11,
    color: '#aaa',
    textAlign: 'center',
  },
  faqItem: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    flex: 1,
    marginRight: 10,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#1a4d7a',
    lineHeight: 20,
  },
  tipsContainer: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 15,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  tipIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0f3460',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 3,
  },
  tipText: {
    fontSize: 13,
    color: '#aaa',
    lineHeight: 18,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#16213e',
    margin: 15,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4caf50',
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  infoText: {
    color: '#aaa',
    fontSize: 13,
    lineHeight: 18,
  },
  reportButton: {
    flexDirection: 'row',
    backgroundColor: '#e94560',
    margin: 15,
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default HelpSupportScreen;
