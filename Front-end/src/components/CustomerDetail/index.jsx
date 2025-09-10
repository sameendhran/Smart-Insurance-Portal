// src/components/CustomerDetail/index.jsx

import React, { useState, useEffect } from 'react';
import { getCustomerById, updateCustomer, getAllCustomers } from '../../services/customerService';
import { getAllCities } from '../../services/cityService';
import ToastNotification from '../ToastNotification';
import { 
  validateName, 
  validateMobile, 
  validateDateOfBirth, 
  validateGender, 
  validateRequired 
} from '../../utils/validation';
import './style.css';

function CustomerDetail({ customerId, mode = 'view', onBack, onSave }) {
  const [customer, setCustomer] = useState(null);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(mode === 'edit');
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [showSearchPopup, setShowSearchPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showNoResultsToast, setShowNoResultsToast] = useState(false);
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

  useEffect(() => {
    fetchCustomerData();
    fetchCitiesData();
  }, [customerId]);

  // Update form data when cities are loaded and we have customer data
  useEffect(() => {
    if (customer && cities.length > 0 && customer.cityName) {
      console.log('Attempting to resolve cityId for cityName:', customer.cityName);
      console.log('Available cities:', cities);
      // Find the city ID based on city name
      const city = cities.find(c => c.cityName === customer.cityName);
      console.log('Found city:', city);
      if (city) {
        setFormData(prev => {
          console.log('Current formData.cityId:', prev.cityId);
          console.log('New cityId to set:', String(city.cityId));
          // Only update if cityId is empty or different
          if (!prev.cityId || prev.cityId !== String(city.cityId)) {
            console.log('Updating cityId from', prev.cityId, 'to', String(city.cityId));
            return {
              ...prev,
              cityId: String(city.cityId)
            };
          }
          console.log('No update needed for cityId');
          return prev;
        });
      } else {
        console.log('No city found for cityName:', customer.cityName);
      }
    }
  }, [customer, cities]);

  const fetchCustomerData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCustomerById(customerId);
      console.log('Received customer data from backend:', data);
      setCustomer(data);
      setFormData({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        gender: data.gender || '',
        dob: data.dob || '',
        mobileNumber: data.mobileNumber || '',
        cityId: data.cityId ? String(data.cityId) : '',
        stateId: data.stateId ? String(data.stateId) : '',
        countryId: data.countryId ? String(data.countryId) : '',
        occupationId: data.occupationId ? String(data.occupationId) : ''
      });
      console.log('Set form data:', {
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        gender: data.gender || '',
        dob: data.dob || '',
        mobileNumber: data.mobileNumber || '',
        cityId: data.cityId ? String(data.cityId) : '',
        stateId: data.stateId ? String(data.stateId) : '',
        countryId: data.countryId ? String(data.countryId) : '',
        occupationId: data.occupationId ? String(data.occupationId) : ''
      });
    } catch (err) {
      setError(err.message || 'Failed to fetch customer details.');
      console.error('Error fetching customer:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCitiesData = async () => {
    try {
      const citiesData = await getAllCities();
      if (Array.isArray(citiesData)) {
        setCities(citiesData);
      }
    } catch (err) {
      console.error('Failed to fetch cities:', err);
    }
  };

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'firstName':
        error = validateName(value);
        break;
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
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validate field on change
    const error = validateField(name, value);
    setValidationErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
    setValidationErrors({});
    setError(null); // Clear any existing error when starting to edit
  };

  const handleCancel = () => {
    setIsEditing(false);
    setValidationErrors({});
    setError(null); // Clear any existing error when canceling
    // Reset form data to original customer data
    // Find the city ID based on city name if cityId is not provided
    let cityId = customer.cityId ? String(customer.cityId) : '';
    if (!cityId && customer.cityName && cities.length > 0) {
      const city = cities.find(c => c.cityName === customer.cityName);
      cityId = city ? String(city.cityId) : '';
    }
    
    setFormData({
      firstName: customer.firstName || '',
      lastName: customer.lastName || '',
      gender: customer.gender || '',
      dob: customer.dob || '',
      mobileNumber: customer.mobileNumber || '',
      cityId: cityId,
      stateId: customer.stateId ? String(customer.stateId) : '',
      countryId: customer.countryId ? String(customer.countryId) : '',
      occupationId: customer.occupationId ? String(customer.occupationId) : ''
    });
  };

  const handleSearchCustomers = async () => {
    if (!searchTerm.trim()) return;
    
    setSearching(true);
    try {
      const allCustomers = await getAllCustomers();
      const filtered = allCustomers.filter(customer => 
        customer.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.mobileNumber?.includes(searchTerm) ||
        customer.cityName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      setSearchResults(filtered);
      
      // Show toast notification if no results found
      if (filtered.length === 0 && allCustomers.length > 0) {
        setShowNoResultsToast(true);
      } else {
        setShowNoResultsToast(false);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleCustomerSelect = (selectedCustomer) => {
    // Navigate to the selected customer's detail page
    if (onBack && typeof onBack === 'function') {
      // This will navigate back to the customer list where user can select the customer
      onBack();
    }
  };

  const validateForm = () => {
    const errors = {};
    const fields = ['firstName', 'lastName', 'gender', 'dob', 'mobileNumber', 'cityId', 'stateId', 'countryId', 'occupationId'];
    
    // Use the most current formData
    const currentFormData = formData;
    console.log('Validating form data:', currentFormData);
    console.log('Current formData.cityId:', currentFormData.cityId);
    console.log('Customer cityName:', customer?.cityName);
    
    fields.forEach(field => {
      const value = currentFormData[field];
      console.log(`Validating field ${field} with value:`, value, 'type:', typeof value);
      const error = validateField(field, value);
      if (error) {
        errors[field] = error;
        console.log(`Validation error for ${field}:`, error);
      }
    });

    console.log('Final validation errors:', errors);
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    // Ensure cityId is resolved before validation
    let updatedFormData = { ...formData };
    if (!updatedFormData.cityId && customer?.cityName && cities.length > 0) {
      const city = cities.find(c => c.cityName === customer.cityName);
      if (city) {
        updatedFormData.cityId = String(city.cityId);
        console.log('Resolved cityId to:', updatedFormData.cityId);
        // Update the form state with resolved cityId
        setFormData(updatedFormData);
      }
    }
    
    // Validate with updated form data
    const errors = {};
    const fields = ['firstName', 'lastName', 'gender', 'dob', 'mobileNumber', 'cityId', 'stateId', 'countryId', 'occupationId'];
    
    console.log('Validating updated form data:', updatedFormData);
    
    fields.forEach(field => {
      const value = updatedFormData[field];
      console.log(`Validating field ${field} with value:`, value, 'type:', typeof value);
      const error = validateField(field, value);
      if (error) {
        errors[field] = error;
        console.log(`Validation error for ${field}:`, error);
      }
    });

    console.log('Final validation errors:', errors);
    setValidationErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      // Don't set a global error, just return - validation errors will be shown inline
      return;
    }

    try {
      setSaving(true);
      setError(null);
      
      // Convert form data to match backend DTO format
      const customerData = {
        firstName: updatedFormData.firstName,
        lastName: updatedFormData.lastName,
        gender: updatedFormData.gender,
        dob: updatedFormData.dob,
        mobileNumber: updatedFormData.mobileNumber,
        cityId: parseInt(updatedFormData.cityId) || 0,
        stateId: parseInt(updatedFormData.stateId) || 0,
        countryId: parseInt(updatedFormData.countryId) || 0,
        occupationId: parseInt(updatedFormData.occupationId) || 0
      };
      
      // Validate that all required ID fields are valid numbers
      if (customerData.cityId <= 0 || customerData.stateId <= 0 || 
          customerData.countryId <= 0 || customerData.occupationId <= 0) {
        setError('Please select all required fields (City, State, Country, Occupation).');
        setSaving(false);
        return;
      }
      
      console.log('Sending customer data to backend:', customerData);
      
      // Call the update service
      const updatedCustomer = await updateCustomer(customerId, customerData);
      
      console.log('Received updated customer from backend:', updatedCustomer);
      
      // Update local state with the updated customer data
      setCustomer(updatedCustomer);
      setIsEditing(false);
      setValidationErrors({});
      
      alert('Customer updated successfully!');
      if (onSave) {
        onSave();
      }
    } catch (err) {
      console.error('Error updating customer:', err);
      setError(err.message || 'Failed to update customer.');
    } finally {
      setSaving(false);
    }
  };



  if (loading) {
    return <div className="customer-detail-loading">Loading customer details...</div>;
  }

  if (error && !isEditing) {
    return (
      <div className="customer-detail-error">
        Error: {error}
        <button onClick={onBack} className="customer-detail-back-button">
          Go Back
        </button>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="customer-detail-error">
        Customer not found.
        <button onClick={onBack} className="customer-detail-back-button">
          Go Back
        </button>
      </div>
    );
  }

  const renderField = (label, value, name, type = 'text', options = null) => {
    const hasError = validationErrors[name];
    
    if (isEditing) {
      return (
        <div className={`customer-detail-field ${hasError ? 'error' : ''}`}>
          <label>{label}:</label>
          {type === 'select' ? (
            <select
              name={name}
              value={formData[name] || ''}
              onChange={handleChange}
              className={`customer-detail-input ${hasError ? 'error' : ''}`}
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
              value={formData[name] || ''}
              onChange={handleChange}
              className={`customer-detail-input ${hasError ? 'error' : ''}`}
            />
          )}
          {hasError && <span className="customer-detail-error-message">{hasError}</span>}
        </div>
      );
    } else {
      return (
        <div className="customer-detail-field">
          <label>{label}:</label>
          <span className="customer-detail-value">{value}</span>
        </div>
      );
    }
  };

  return (
    <div className="customer-detail-container">
      <div className="customer-detail-header">
        <h2 className="customer-detail-title">
          {isEditing ? 'Edit Customer' : 'Customer Details'}
        </h2>
        <div className="customer-detail-actions">
          {!isEditing ? (
            <>
              <button onClick={handleEdit} className="customer-detail-edit-button">
                ✏️ Edit
              </button>
              <button onClick={() => setShowSearchPopup(true)} className="customer-detail-search-button">
                🔍 Search Customers
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={handleSave} 
                className="customer-detail-save-button"
                disabled={saving}
              >
                {saving ? '💾 Saving...' : '💾 Save'}
              </button>
              <button 
                onClick={handleCancel} 
                className="customer-detail-cancel-button"
                disabled={saving}
              >
                ❌ Cancel
              </button>
            </>
          )}
          <button onClick={onBack} className="customer-detail-back-button">
            ← Back
          </button>
        </div>
      </div>

      <div className="customer-detail-content">
        <div className="customer-detail-grid">
          {renderField('First Name', customer.firstName, 'firstName')}
          {renderField('Last Name', customer.lastName, 'lastName')}
          {renderField('Gender', customer.gender, 'gender', 'select', [
            { id: 'M', name: 'Male' },
            { id: 'F', name: 'Female' },
            { id: 'Other', name: 'Other' }
          ])}
          {renderField('Date of Birth', customer.dob, 'dob', 'date')}
          {renderField('Mobile Number', customer.mobileNumber, 'mobileNumber')}
          {renderField('City', customer.cityName, 'cityId', 'select', cities)}
          {renderField('State', customer.stateId, 'stateId', 'select', states)}
          {renderField('Country', customer.countryId, 'countryId', 'select', countries)}
          {renderField('Occupation', customer.occupationId, 'occupationId', 'select', occupations)}
          {renderField('Created Date', customer.createdDate)}
        </div>
      </div>

      {/* Search Customer Popup */}
      {showSearchPopup && (
        <div className="search-popup-overlay">
          <div className="search-popup">
            <div className="search-popup-header">
              <h3>Search Customers</h3>
              <button 
                onClick={() => setShowSearchPopup(false)} 
                className="search-popup-close"
              >
                ×
              </button>
            </div>
            
            <div className="search-popup-content">
              <div className="search-input-group">
                <input
                  type="text"
                  placeholder="Search by name, mobile, or city..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearchCustomers()}
                  className="search-popup-input"
                />
                <button 
                  onClick={handleSearchCustomers}
                  disabled={searching || !searchTerm.trim()}
                  className="search-popup-button"
                >
                  {searching ? '🔍 Searching...' : '🔍 Search'}
                </button>
              </div>

              {searchResults.length > 0 && (
                <div className="search-results">
                  <h4>Search Results ({searchResults.length})</h4>
                  <div className="search-results-list">
                    {searchResults.map(customer => (
                      <div 
                        key={customer.customerId} 
                        className="search-result-item"
                        onClick={() => handleCustomerSelect(customer)}
                      >
                        <div className="customer-info">
                          <strong>{customer.firstName} {customer.lastName}</strong>
                          <span>{customer.mobileNumber}</span>
                          <span>{customer.cityName}</span>
                        </div>
                        <button className="view-customer-btn">👁️ View</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {searchResults.length === 0 && searchTerm && !searching && (
                <div className="no-results">
                  <p>No customers found matching your search.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification for No Search Results */}
      <ToastNotification
        message="No results found for your search. Please try again."
        type="warning"
        show={showNoResultsToast}
        onClose={() => setShowNoResultsToast(false)}
        duration={5000}
      />
    </div>
  );
}

export default CustomerDetail; 