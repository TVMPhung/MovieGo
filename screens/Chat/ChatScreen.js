/**
 * MEMBER 4: Chat Screen
 * Customers can chat with store/customer support
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/store';

const ChatScreen = ({ navigation }) => {
  const user = useAuthStore((state) => state.user);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef(null);

  // Predefined responses from support bot
  const supportResponses = {
    greeting: [
      "Hello! Welcome to MovieGo support. How can I help you today?",
      "Hi there! I'm here to assist you with any questions about MovieGo.",
    ],
    booking: [
      "To book a ticket, go to the Movies tab, select a movie, choose your showtime, and pick your seats. Let me know if you need help with any step!",
      "Booking is easy! Browse movies → Select showtime → Choose seats → Make payment. Need help with anything specific?",
    ],
    payment: [
      "We accept Credit/Debit Cards, Digital Wallets, and UPI. All payments are secure and processed instantly.",
      "Payment is safe and secure! We support multiple payment methods including cards and digital wallets.",
    ],
    cancel: [
      "To cancel a booking, please contact our support team at support@moviego.com or call +1 (555) 000-0000. Cancellation policies apply.",
      "Cancellations can be made up to 2 hours before showtime. Please reach out to support@moviego.com for assistance.",
    ],
    location: [
      "We have 4 cinema locations! Check the Map tab to find the nearest MovieGo cinema to you.",
      "You can find all our cinema locations in the Map screen. We're located throughout the city!",
    ],
    profile: [
      "You can update your profile information in the Profile tab. Just tap the edit icon and save your changes.",
      "Go to the Profile tab to view and edit your personal information, including name, phone, and address.",
    ],
    help: [
      "I can help you with: Bookings, Payments, Cancellations, Locations, Profile updates, and general questions. What do you need help with?",
    ],
    default: [
      "I'm here to help! Could you please provide more details about your question?",
      "Thank you for reaching out. Can you tell me more about what you need assistance with?",
      "I'd be happy to help! Please let me know what specific information you're looking for.",
    ],
  };

  // Initialize chat with welcome message on mount
  useEffect(() => {
    const welcomeMessage = {
      id: Date.now().toString(),
      text: `Hello ${user?.fullName || 'there'}! 👋\n\nI'm MovieGo Support Bot. I can help you with:\n\n• Movie bookings\n• Payment questions\n• Cinema locations\n• Account management\n• General inquiries\n\nHow can I assist you today?`,
      sender: 'support',
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, []);

  // Detect user intent from message keywords
  const detectIntent = (text) => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.match(/hi|hello|hey|good morning|good afternoon/)) {
      return 'greeting';
    } else if (lowerText.match(/book|ticket|seat|show|movie/)) {
      return 'booking';
    } else if (lowerText.match(/pay|payment|card|wallet|upi/)) {
      return 'payment';
    } else if (lowerText.match(/cancel|refund/)) {
      return 'cancel';
    } else if (lowerText.match(/location|address|where|cinema|theater/)) {
      return 'location';
    } else if (lowerText.match(/profile|update|edit|change/)) {
      return 'profile';
    } else if (lowerText.match(/help|assist|support/)) {
      return 'help';
    }
    return 'default';
  };

  // Get random response for variety
  const getRandomResponse = (responseArray) => {
    return responseArray[Math.floor(Math.random() * responseArray.length)];
  };

  // Send message and get bot response
  const handleSend = () => {
    if (inputText.trim() === '') return;

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');

    // Simulate typing
    setIsTyping(true);

    // Get bot response after a delay
    setTimeout(() => {
      const intent = detectIntent(inputText);
      const responseText = getRandomResponse(supportResponses[intent]);

      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'support',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  // Format timestamp to readable time
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Render quick reply buttons
  const renderQuickReplies = () => {
    const quickReplies = [
      { icon: 'ticket', text: 'Book Tickets', message: 'How do I book tickets?' },
      { icon: 'card', text: 'Payment', message: 'What payment methods do you accept?' },
      { icon: 'location', text: 'Locations', message: 'Where are your cinemas?' },
      { icon: 'help-circle', text: 'Help', message: 'I need help' },
    ];

    return (
      <View style={styles.quickRepliesContainer}>
        <Text style={styles.quickRepliesTitle}>Quick Replies:</Text>
        <View style={styles.quickRepliesButtons}>
          {quickReplies.map((reply, index) => (
            <TouchableOpacity
              key={index}
              style={styles.quickReplyButton}
              onPress={() => {
                setInputText(reply.message);
                setTimeout(() => handleSend(), 100);
              }}
            >
              <Ionicons name={reply.icon} size={16} color="#e94560" />
              <Text style={styles.quickReplyText}>{reply.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  // Render individual message bubble
  const renderMessage = ({ item }) => {
    const isUser = item.sender === 'user';

    return (
      <View
        style={[
          styles.messageContainer,
          isUser ? styles.userMessageContainer : styles.supportMessageContainer,
        ]}
      >
        {!isUser && (
          <View style={styles.supportAvatar}>
            <Ionicons name="chatbubbles" size={20} color="#fff" />
          </View>
        )}
        <View
          style={[
            styles.messageBubble,
            isUser ? styles.userBubble : styles.supportBubble,
          ]}
        >
          <Text style={[styles.messageText, isUser && styles.userMessageText]}>
            {item.text}
          </Text>
          <Text
            style={[styles.messageTime, isUser && styles.userMessageTime]}
          >
            {formatTime(item.timestamp)}
          </Text>
        </View>
        {isUser && (
          <View style={styles.userAvatar}>
            <Ionicons name="person" size={20} color="#fff" />
          </View>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerAvatar}>
            <Ionicons name="chatbubbles" size={24} color="#fff" />
          </View>
          <View>
            <Text style={styles.headerTitle}>MovieGo Support</Text>
            <Text style={styles.headerStatus}>
              {isTyping ? 'Typing...' : 'Online • Usually replies instantly'}
            </Text>
          </View>
        </View>
      </View>

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
      />

      {/* Typing Indicator */}
      {isTyping && (
        <View style={styles.typingContainer}>
          <View style={styles.typingBubble}>
            <View style={styles.typingDot} />
            <View style={[styles.typingDot, styles.typingDotDelay1]} />
            <View style={[styles.typingDot, styles.typingDotDelay2]} />
          </View>
        </View>
      )}

      {/* Quick Replies - Show when no messages yet or at start */}
      {messages.length <= 1 && renderQuickReplies()}

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          placeholderTextColor="#666"
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!inputText.trim()}
        >
          <Ionicons
            name="send"
            size={20}
            color={inputText.trim() ? '#fff' : '#666'}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f3460',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#16213e',
    borderBottomWidth: 1,
    borderBottomColor: '#1a4d7a',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e94560',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerStatus: {
    fontSize: 12,
    color: '#4caf50',
    marginTop: 2,
  },
  messagesList: {
    padding: 15,
    flexGrow: 1,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'flex-end',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  supportMessageContainer: {
    justifyContent: 'flex-start',
  },
  supportAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e94560',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4caf50',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 12,
    borderRadius: 12,
  },
  userBubble: {
    backgroundColor: '#e94560',
    borderBottomRightRadius: 4,
  },
  supportBubble: {
    backgroundColor: '#16213e',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    color: '#fff',
    lineHeight: 20,
  },
  userMessageText: {
    color: '#fff',
  },
  messageTime: {
    fontSize: 11,
    color: '#aaa',
    marginTop: 4,
  },
  userMessageTime: {
    color: '#ffcccc',
  },
  typingContainer: {
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16213e',
    padding: 12,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginLeft: 40,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#aaa',
    marginHorizontal: 2,
    opacity: 0.4,
  },
  typingDotDelay1: {
    opacity: 0.6,
  },
  typingDotDelay2: {
    opacity: 0.8,
  },
  quickRepliesContainer: {
    padding: 15,
    paddingTop: 10,
    backgroundColor: '#0f3460',
  },
  quickRepliesTitle: {
    fontSize: 13,
    color: '#aaa',
    marginBottom: 10,
  },
  quickRepliesButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickReplyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16213e',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1a4d7a',
  },
  quickReplyText: {
    color: '#fff',
    fontSize: 13,
    marginLeft: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#16213e',
    borderTopWidth: 1,
    borderTopColor: '#1a4d7a',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: '#0f3460',
    color: '#fff',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 15,
    maxHeight: 100,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#1a4d7a',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e94560',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#1a4d7a',
  },
});

export default ChatScreen;
