/**
 * Navigation Configuration
 * Main navigation structure for MovieGo app
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../store/store';

// Import screens (will be created)
import LoginScreen from '../screens/Auth/LoginScreen';
import SignUpScreen from '../screens/Auth/SignUpScreen';
import MoviesListScreen from '../screens/Movies/MoviesListScreen';
import MovieDetailsScreen from '../screens/Movies/MovieDetailsScreen';
import BookingScreen from '../screens/Booking/BookingScreen';
import PaymentScreen from '../screens/Payment/PaymentScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import TicketHistoryScreen from '../screens/History/TicketHistoryScreen';
import BookingConfirmationScreen from '../screens/Booking/BookingConfirmationScreen';
import MapScreen from '../screens/Map/MapScreen';
import ChatScreen from '../screens/Chat/ChatScreen';
import ChangePasswordScreen from '../screens/Profile/ChangePasswordScreen';
import NotificationScreen from '../screens/Settings/NotificationScreen';
import HelpSupportScreen from '../screens/Support/HelpSupportScreen';
import TermsConditionsScreen from '../screens/Legal/TermsConditionsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/**
 * Auth Stack Navigator - Login and Sign Up
 */
const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1a1a2e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="SignUp" 
        component={SignUpScreen}
        options={{ title: 'Create Account' }}
      />
    </Stack.Navigator>
  );
};

/**
 * Movies Stack Navigator
 */
const MoviesStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1a1a2e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="MoviesList" 
        component={MoviesListScreen}
        options={{ title: 'Movies' }}
      />
      <Stack.Screen 
        name="MovieDetails" 
        component={MovieDetailsScreen}
        options={{ title: 'Movie Details' }}
      />
      <Stack.Screen 
        name="Booking" 
        component={BookingScreen}
        options={{ title: 'Book Tickets' }}
      />
      <Stack.Screen 
        name="Payment" 
        component={PaymentScreen}
        options={{ title: 'Payment' }}
      />
      <Stack.Screen 
        name="BookingConfirmation" 
        component={BookingConfirmationScreen}
        options={{ 
          title: 'Booking Confirmed',
          headerLeft: null, // Prevent going back
        }}
      />
    </Stack.Navigator>
  );
};

/**
 * History Stack Navigator
 */
const HistoryStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1a1a2e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="TicketHistory" 
        component={TicketHistoryScreen}
        options={{ title: 'My Tickets' }}
      />
    </Stack.Navigator>
  );
};

/**
 * Profile Stack Navigator
 */
const ProfileStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1a1a2e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="ProfileMain" 
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
      <Stack.Screen 
        name="ChangePassword" 
        component={ChangePasswordScreen}
        options={{ title: 'Change Password' }}
      />
      <Stack.Screen 
        name="Notifications" 
        component={NotificationScreen}
        options={{ title: 'Notifications' }}
      />
      <Stack.Screen 
        name="HelpSupport" 
        component={HelpSupportScreen}
        options={{ title: 'Help & Support' }}
      />
      <Stack.Screen 
        name="TermsConditions" 
        component={TermsConditionsScreen}
        options={{ title: 'Terms & Conditions' }}
      />
    </Stack.Navigator>
  );
};

/**
 * Map Stack Navigator (MEMBER 4)
 */
const MapStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1a1a2e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="MapMain" 
        component={MapScreen}
        options={{ title: 'Cinema Locations' }}
      />
    </Stack.Navigator>
  );
};

/**
 * Chat Stack Navigator (MEMBER 4)
 */
const ChatStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1a1a2e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="ChatMain" 
        component={ChatScreen}
        options={{ title: 'Support Chat' }}
      />
    </Stack.Navigator>
  );
};

/**
 * Main Tab Navigator - Bottom tabs
 */
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'MoviesTab') {
            iconName = focused ? 'film' : 'film-outline';
          } else if (route.name === 'HistoryTab') {
            iconName = focused ? 'ticket' : 'ticket-outline';
          } else if (route.name === 'MapTab') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'ChatTab') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#e94560',
        tabBarInactiveTintColor: '#8d8d8d',
        tabBarStyle: {
          backgroundColor: '#16213e',
          borderTopColor: '#0f3460',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="MoviesTab" 
        component={MoviesStack}
        options={{ title: 'Movies' }}
      />
      <Tab.Screen 
        name="HistoryTab" 
        component={HistoryStack}
        options={{ title: 'My Tickets' }}
      />
      <Tab.Screen 
        name="MapTab" 
        component={MapStack}
        options={{ title: 'Locations' }}
      />
      <Tab.Screen 
        name="ChatTab" 
        component={ChatStack}
        options={{ title: 'Support' }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileStack}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

/**
 * Root Navigator - Switches between Auth and Main based on authentication
 */
const RootNavigator = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default RootNavigator;
