// Component to add a new customer
// Handles form inputs, validation, and submission to backend

import React, { useState, useEffect } from 'react';
import { createCustomer } from '../../services/customerService';
import { getAllCities } from '../../services/cityService';
import { 
  validateName, 
  validateMobile, 
  validateDateOfBirth, 
  validateGender, 
  validateRequired,
  PATTERNS 
} from '../../utils/validation';

import './style.css';

// This component is called from App.jsx and will go back after completing action
const AddCustomer = ({ onActionComplete }) => {

  // State to store form values entered by the user
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    dob: '',
    mobileNumber: '',
    cityId: '',
    stateId: '',
    countryId: '',
    occupationId: ''
  });

  // To track field-wise errors and touched fields
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // To store list of cities fetched from backend
  const [cities, setCities] = useState([]);

  // Static dropdown values for states, countries and occupations
  const [states] = useState([
    { id: 1, name: 'Tamil Nadu' }, { id: 2, name: 'California' },
    { id: 3, name: 'England' }, { id: 4, name: 'Ontario' },
    { id: 5, name: 'New South Wales' }, { id: 6, name: 'Bavaria' },
    { id: 7, name: 'Tokyo' }, { id: 8, name: 'Île-de-France' }
  ]);
  const [countries] = useState([
    { id: 1, name: 'India' }, { id: 2, name: 'USA' },
    { id: 3, name: 'UK' }, { id: 4, name: 'Canada' },
    { id: 5, name: 'Australia' }, { id: 6, name: 'Germany' },
    { id: 7, name: 'Japan' }, { id: 8, name: 'France' }
  ]);
  const [occupations] = useState([
    { id: 1, name: 'Engineer' }, { id: 2, name: 'Doctor' },
    { id: 3, name: 'Teacher' }, { id: 4, name: 'Business' },
    { id: 5, name: 'Student' }, { id: 6, name: 'Retired' }
  ]);

  // Popup message shown after form submission
  const [popup, setPopup] = useState(null);

  // Flag to show loading state when form is submitting
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Flag to display all error messages after form submit
  const [showAllErrors, setShowAllErrors] = useState(false);

  // Load cities data from backend when component first loads
  useEffect(() => {
    const fetchCitiesData = async () => {
      try {
        const citiesData = await getAllCities();
        if (Array.isArray(citiesData)) {
          setCities(citiesData); // Store fetched cities in state
        } else {
          // If response is not in expected format
          console.warn('City data not in expected format:', citiesData);
          setPopup({ type: 'error', message: 'Failed to load cities data.' });
        }
      } catch (err) {
        // If API call fails
        console.error('Failed to fetch cities:', err);
        setPopup({ type: 'error', message: 'Error fetching cities. Check backend connection.' });
      }
    };
    fetchCitiesData();
  }, []);

  // This function updates the value of form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));

    // Validate each field as the user types
    validateField(name, value);
  };

  // This runs when a user clicks out of a field
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, value); // Validate after blur
  };

  // This function checks for validation errors in each field
  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'firstName':
      case 'lastName':
        error = validateName(value);
        break;
      case 'gender':
        error = validateGender(value);
        break;
      case 'dob':
        error = validateDateOfBirth(value);
        break;
      case 'mobileNumber':
        error = validateMobile(value);
        break;
      case 'cityId':
        error = validateRequired(value, 'City');
        break;
      case 'stateId':
        error = validateRequired(value, 'State');
        break;
      case 'countryId':
        error = validateRequired(value, 'Country');
        break;
      case 'occupationId':
        error = validateRequired(value, 'Occupation');
        break;
      default:
        break;
    }

    setErrors(prev => ({ ...prev, [name]: error }));
    return error;
  };

  // Validate the full form and return true or false
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(form).forEach(fieldName => {
      const error = validateField(fieldName, form[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // Called when the user submits the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setPopup(null); // Clear previous popup
    setIsSubmitting(true);
    setShowAllErrors(true); // Show all validation errors

    // First check all fields are valid
    if (!validateForm()) {
      setIsSubmitting(false);
      setPopup({ type: 'error', message: 'Please fix the validation errors before submitting.' });
      return;
    }

    try {
      // Create object that matches backend expected structure
      const customerData = {
        firstName: form.firstName,
        lastName: form.lastName,
        gender: form.gender,
        dob: form.dob,
        mobileNumber: form.mobileNumber,
        cityId: parseInt(form.cityId),
        stateId: parseInt(form.stateId),
        countryId: parseInt(form.countryId),
        occupationId: parseInt(form.occupationId)
      };
      
      // Check dropdowns are not left empty
      if (customerData.cityId <= 0 || customerData.stateId <= 0 || 
          customerData.countryId <= 0 || customerData.occupationId <= 0) {
        setPopup({ type: 'error', message: 'Please select all required fields (City, State, Country, Occupation).' });
        setIsSubmitting(false);
        return;
      }
      
      // Send customer data to backend API
      console.log('Sending customer data to backend:', customerData);
      const newCustomer = await createCustomer(customerData);

      if (newCustomer) {
        // Show success popup and reset form
        setPopup({ type: 'success', message: 'Customer added successfully!' });
        setIsSubmitting(false);

        // Clear form and reset states
        setForm({
          firstName: '',
          lastName: '',
          gender: '',
          dob: '',
          mobileNumber: '',
          cityId: '',
          stateId: '',
          countryId: '',
          occupationId: ''
        });
        setErrors({});
        setTouched({});
        setShowAllErrors(false);
        
        // Navigate back to previous screen after a short delay
        setTimeout(() => {
          setPopup(null);
          if (onActionComplete) {
            onActionComplete();
          }
        }, 1500);
      } else {
        // If creation failed, show error
        setPopup({ type: 'error', message: 'Failed to add customer. Please try again.' });
        setIsSubmitting(false);
      }
    } catch (err) {
      // Catch errors like network or server error
      console.error('Submit error:', err);
      let errorMessage = 'Something went wrong.';
      if (err.message) {
        errorMessage = err.message;
      } else if (err.response) {
        errorMessage = err.response.data?.failureMessage || `Server Error: ${err.response.status}`;
      } else if (err.request) {
        errorMessage = 'Network Error: No response from server. Check if backend is running.';
      } else {
        errorMessage = `Request Error: ${err.message}`;
      }
      setPopup({ type: 'error', message: errorMessage });
      setIsSubmitting(false);
    }
  };

  // This function renders individual input or select fields
  const renderField = (name, label, type = 'text', options = null) => {
    const hasError = (touched[name] || showAllErrors) && errors[name];
    
    return (
      <div className={`form-group ${hasError ? 'error' : ''}`}>
        <label>{label}</label>
        {type === 'select' ? (
          <select 
            name={name} 
            value={form[name]} 
            onChange={handleChange}
            onBlur={handleBlur}
            className={hasError ? 'error' : ''}
            required
          >
            <option value="">Select {label}</option>
            {options?.map((option) => (
              <option key={option.id || option.cityId} value={option.id || option.cityId}>
                {option.name || option.cityName}
              </option>
            ))}
          </select>
        ) : (
          <input 
            type={type} 
            name={name} 
            value={form[name]} 
            onChange={handleChange}
            onBlur={handleBlur}
            className={hasError ? 'error' : ''}
            required
          />
        )}
        {hasError && <span className="error-message">{errors[name]}</span>}
      </div>
    );
  };

  // Main return to render the full UI
  return (
    <div className="add-form">
      <h2 className="add-title">Add New Customer</h2>

      {/* Show popup for success or error */}
      {popup && (
        <div
          className={`popup ${popup.type}`}
          style={{
            padding: '10px',
            marginBottom: '20px',
            color: '#fff',
            backgroundColor: popup.type === 'success' ? '#4caf50' : '#e74c3c',
            borderRadius: '6px',
            textAlign: 'center'
          }}
        >
          {popup.message}
        </div>
      )}

      {/* Show error summary list when form is submitted */}
      {showAllErrors && Object.keys(errors).some(key => errors[key]) && (
        <div className="validation-summary" style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '6px',
          padding: '1rem',
          marginBottom: '1.5rem',
          color: '#991b1b'
        }}>
          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Please fix the following errors:</h4>
          <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
            {Object.keys(errors).map(fieldName => {
              if (errors[fieldName]) {
                const fieldLabel = fieldName === 'firstName' ? 'First Name' :
                                 fieldName === 'lastName' ? 'Last Name' :
                                 fieldName === 'mobileNumber' ? 'Mobile Number' :
                                 fieldName === 'dob' ? 'Date of Birth' :
                                 fieldName === 'cityId' ? 'City' :
                                 fieldName === 'stateId' ? 'State' :
                                 fieldName === 'countryId' ? 'Country' :
                                 fieldName === 'occupationId' ? 'Occupation' :
                                 fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
                return (
                  <li key={fieldName} style={{ marginBottom: '0.25rem' }}>
                    <strong>{fieldLabel}:</strong> {errors[fieldName]}
                  </li>
                );
              }
              return null;
            })}
          </ul>
        </div>
      )}

      {/* Form layout with fields */}
      <form onSubmit={handleSubmit} className="form-grid">
        {renderField('firstName', 'First Name')}
        {renderField('lastName', 'Last Name')}
        {renderField('gender', 'Gender', 'select', [
          { id: 'M', name: 'Male' },
          { id: 'F', name: 'Female' },
          { id: 'Other', name: 'Other' }
        ])}
        {renderField('dob', 'Date of Birth', 'date')}
        {renderField('mobileNumber', 'Mobile Number')}
        {renderField('cityId', 'City', 'select', cities)}
        {renderField('stateId', 'State', 'select', states)}
        {renderField('countryId', 'Country', 'select', countries)}
        {renderField('occupationId', 'Occupation', 'select', occupations)}

        {/* Submit and Cancel buttons */}
        <div className="btn-row">
          <button type="submit" className="btn-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Adding Customer...' : 'Add Customer'}
          </button>
          <button
            type="button"
            className="btn-cancel"
            onClick={onActionComplete}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCustomer;
