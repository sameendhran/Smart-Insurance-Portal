// src/utils/validation.js
import { useState } from 'react';

// Validation patterns
export const PATTERNS = {
  NAME: /^[a-zA-Z\s]{1,50}$/, // Letters and spaces only, 1-50 characters (updated for Indian names)
  MOBILE: /^[0-9]{10}$/, // Exactly 10 digits only (matching backend validation)
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Basic email validation
  PREMIUM: /^[0-9]+(\.[0-9]{1,2})?$/, // Positive number with up to 2 decimal places
  DATE: /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD format
  ALPHANUMERIC: /^[a-zA-Z0-9\s]+$/, // Letters, numbers, and spaces
  NUMERIC: /^[0-9]+$/, // Numbers only
};

// Validation messages
export const MESSAGES = {
  REQUIRED: 'This field is required',
  NAME_INVALID: 'Name should contain only letters and spaces (1-50 characters)',
  MOBILE_INVALID: 'Mobile number should be exactly 10 digits (e.g., 9876543210)',
  EMAIL_INVALID: 'Please enter a valid email address',
  PREMIUM_INVALID: 'Premium should be a positive number with up to 2 decimal places',
  DATE_INVALID: 'Please select a valid date',
  DATE_FUTURE: 'Date of birth cannot be in the future',
  DATE_TOO_OLD: 'Date of birth cannot be more than 120 years ago',
  MIN_LENGTH: (field, min) => `${field} should be at least ${min} characters`,
  MAX_LENGTH: (field, max) => `${field} should not exceed ${max} characters`,
  MIN_VALUE: (field, min) => `${field} should be at least ${min}`,
  MAX_VALUE: (field, max) => `${field} should not exceed ${max}`,
};

// Validation functions
export const validateField = (name, value, rules = {}) => {
  const {
    required = false,
    pattern = null,
    minLength = null,
    maxLength = null,
    minValue = null,
    maxValue = null,
    customValidation = null,
  } = rules;

  // Convert value to string for validation
  const stringValue = value != null ? String(value) : '';

  // Required validation
  if (required && (!stringValue || stringValue.trim() === '')) {
    return MESSAGES.REQUIRED;
  }

  // Skip other validations if value is empty and not required
  if (!stringValue || stringValue.trim() === '') {
    return '';
  }

  // Pattern validation
  if (pattern && !pattern.test(stringValue)) {
    switch (pattern) {
      case PATTERNS.NAME:
        return MESSAGES.NAME_INVALID;
      case PATTERNS.MOBILE:
        return MESSAGES.MOBILE_INVALID;
      case PATTERNS.EMAIL:
        return MESSAGES.EMAIL_INVALID;
      case PATTERNS.PREMIUM:
        return MESSAGES.PREMIUM_INVALID;
      case PATTERNS.DATE:
        return MESSAGES.DATE_INVALID;
      default:
        return 'Invalid format';
    }
  }

  // Length validations
  if (minLength && stringValue.length < minLength) {
    return MESSAGES.MIN_LENGTH(name, minLength);
  }

  if (maxLength && stringValue.length > maxLength) {
    return MESSAGES.MAX_LENGTH(name, maxLength);
  }

  // Value validations
  if (minValue !== null && parseFloat(stringValue) < minValue) {
    return MESSAGES.MIN_VALUE(name, minValue);
  }

  if (maxValue !== null && parseFloat(stringValue) > maxValue) {
    return MESSAGES.MAX_VALUE(name, maxValue);
  }

  // Custom validation
  if (customValidation) {
    const customError = customValidation(stringValue);
    if (customError) {
      return customError;
    }
  }

  return ''; // No error
};

// Specific validation functions
export const validateName = (value) => {
  return validateField('Name', value, {
    required: true,
    pattern: PATTERNS.NAME,
    minLength: 1,
    maxLength: 50,
  });
};

export const validateMobile = (value) => {
  return validateField('Mobile Number', value, {
    required: true,
    pattern: PATTERNS.MOBILE,
  });
};

export const validateEmail = (value) => {
  return validateField('Email', value, {
    pattern: PATTERNS.EMAIL,
  });
};

export const validatePremium = (value) => {
  return validateField('Premium', value, {
    required: true,
    pattern: PATTERNS.PREMIUM,
    minValue: 1,
    maxValue: 1000000, // 1 million max
  });
};

export const validateDateOfBirth = (value) => {
  if (!value) return MESSAGES.REQUIRED;

  const today = new Date();
  const selectedDate = new Date(value);
  const ageInYears = (today - selectedDate) / (1000 * 60 * 60 * 24 * 365.25);

  if (selectedDate > today) {
    return MESSAGES.DATE_FUTURE;
  }

  if (ageInYears > 120) {
    return MESSAGES.DATE_TOO_OLD;
  }

  return '';
};

export const validateGender = (value) => {
  const stringValue = value != null ? String(value) : '';
  if (!stringValue) return MESSAGES.REQUIRED;
  if (!['M', 'F', 'Other'].includes(stringValue)) {
    return 'Please select a valid gender (Male, Female, or Other)';
  }
  return '';
};

export const validateRequired = (value, fieldName) => {
  return validateField(fieldName, value, { required: true });
};

// Form validation
export const validateForm = (formData, validationRules) => {
  const errors = {};
  let isValid = true;

  Object.keys(validationRules).forEach(fieldName => {
    const value = formData[fieldName];
    const rules = validationRules[fieldName];
    const error = validateField(fieldName, value, rules);
    
    if (error) {
      errors[fieldName] = error;
      isValid = false;
    }
  });

  return { isValid, errors };
};

// Real-time validation hook
export const useFormValidation = (initialData, validationRules) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validate on change if field has been touched
    if (touched[name]) {
      const error = validateField(name, value, validationRules[name]);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const value = formData[name];
    const error = validateField(name, value, validationRules[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateAll = () => {
    const newErrors = {};
    Object.keys(validationRules).forEach(fieldName => {
      const value = formData[fieldName];
      const error = validateField(fieldName, value, validationRules[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return {
    formData,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    setFormData,
  };
}; 