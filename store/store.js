/**
 * Global State Management using Zustand
 * Manages authentication and app state
 */

import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  // Current user state
  user: null,
  isAuthenticated: false,
  
  // Login action
  login: (userData) => set({ 
    user: userData, 
    isAuthenticated: true 
  }),
  
  // Logout action
  logout: () => set({ 
    user: null, 
    isAuthenticated: false 
  }),
  
  // Update user profile
  updateProfile: (updatedData) => set((state) => ({
    user: { ...state.user, ...updatedData }
  }))
}));

export const useBookingStore = create((set) => ({
  // Current booking state
  selectedMovie: null,
  selectedShowtime: null,
  selectedDate: null,
  selectedSeats: [],
  totalAmount: 0,
  
  // Set selected movie
  setMovie: (movie) => set({ selectedMovie: movie }),
  
  // Set selected showtime
  setShowtime: (showtime) => set({ selectedShowtime: showtime }),
  
  // Set selected date
  setDate: (date) => set({ selectedDate: date }),
  
  // Set selected seats
  setSeats: (seats, amount) => set({ 
    selectedSeats: seats, 
    totalAmount: amount 
  }),
  
  // Clear booking
  clearBooking: () => set({
    selectedMovie: null,
    selectedShowtime: null,
    selectedDate: null,
    selectedSeats: [],
    totalAmount: 0
  })
}));
