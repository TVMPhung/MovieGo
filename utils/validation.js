/**
 * Input Validation Utilities
 * Simple validation functions for user input
 */

/**
 * Validate full name - no special characters allowed
 * Only letters, spaces, hyphens, and apostrophes are allowed
 * @param {string} fullName - The full name to validate
 * @returns {Object} - { isValid: boolean, error: string }
 */
export const validateFullName = (fullName) => {
  if (!fullName || fullName.trim().length === 0) {
    return {
      isValid: false,
      error: 'Full name is required',
    };
  }

  if (fullName.trim().length < 2) {
    return {
      isValid: false,
      error: 'Full name must be at least 2 characters',
    };
  }

  // Allow only letters, spaces, hyphens, and apostrophes
  const nameRegex = /^[a-zA-Z\s'-]+$/;
  if (!nameRegex.test(fullName.trim())) {
    return {
      isValid: false,
      error: 'Full name can only contain letters, spaces, hyphens, and apostrophes',
    };
  }

  return {
    isValid: true,
    error: '',
  };
};

/**
 * Validate phone number - exactly 10 digits
 * @param {string} phone - The phone number to validate
 * @param {boolean} isOptional - Whether the phone is optional
 * @returns {Object} - { isValid: boolean, error: string }
 */
export const validatePhone = (phone, isOptional = false) => {
  // If phone is optional and empty, it's valid
  if (isOptional && (!phone || phone.trim().length === 0)) {
    return {
      isValid: true,
      error: '',
    };
  }

  if (!phone || phone.trim().length === 0) {
    return {
      isValid: false,
      error: 'Phone number is required',
    };
  }

  // Remove spaces, hyphens, and parentheses for validation
  const cleanPhone = phone.replace(/[\s\-()]/g, '');

  // Check if it contains only digits
  if (!/^\d+$/.test(cleanPhone)) {
    return {
      isValid: false,
      error: 'Phone number can only contain digits',
    };
  }

  // Check if it's exactly 10 digits
  if (cleanPhone.length !== 10) {
    return {
      isValid: false,
      error: 'Phone number must be exactly 10 digits',
    };
  }

  return {
    isValid: true,
    error: '',
  };
};

/**
 * Validate email address
 * @param {string} email - The email to validate
 * @returns {Object} - { isValid: boolean, error: string }
 */
export const validateEmail = (email) => {
  if (!email || email.trim().length === 0) {
    return {
      isValid: false,
      error: 'Email is required',
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return {
      isValid: false,
      error: 'Please enter a valid email address',
    };
  }

  return {
    isValid: true,
    error: '',
  };
};

/**
 * Validate password
 * @param {string} password - The password to validate
 * @returns {Object} - { isValid: boolean, error: string }
 */
export const validatePassword = (password) => {
  if (!password || password.length === 0) {
    return {
      isValid: false,
      error: 'Password is required',
    };
  }

  if (password.length < 6) {
    return {
      isValid: false,
      error: 'Password must be at least 6 characters long',
    };
  }

  return {
    isValid: true,
    error: '',
  };
};

/**
 * Validate password confirmation
 * @param {string} password - The original password
 * @param {string} confirmPassword - The confirmation password
 * @returns {Object} - { isValid: boolean, error: string }
 */
export const validatePasswordMatch = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    return {
      isValid: false,
      error: 'Passwords do not match',
    };
  }

  return {
    isValid: true,
    error: '',
  };
};
