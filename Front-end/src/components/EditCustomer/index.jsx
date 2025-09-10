// src/components/EditCustomer/index.jsx

import React, { useState, useEffect } from 'react';
import { getCustomerById, updateCustomer } from '../../services/customerService';
import { validateName, validateMobile, validateEmail, validateDateOfBirth, validateRequired } from '../../utils/validation';
import './style.css';

const EditCustomer = ({ customer, onActionComplete }) => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [popup, setPopup] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // If a customer object is directly passed, use it to populate the form
    if (customer) {
      setForm({
        firstName: customer.firstName || '',
        lastName: customer.lastName || '',
        email: customer.email || '',
        phone: customer.phone || customer.mobileNumber || '',
        address: customer.address || '',
        dateOfBirth: customer.dateOfBirth || customer.dob || '',
      });
      setLoading(false);
    } else {
      // Fallback: If customer prop is not directly provided, fetch by ID
      const fetchCustomer = async () => {
        setLoading(true);
        setError(null);
        try {
          const fetchedCustomer = await getCustomerById(customer.customerId);
          setForm({
            firstName: fetchedCustomer.firstName || '',
            lastName: fetchedCustomer.lastName || '',
            email: fetchedCustomer.email || '',
            phone: fetchedCustomer.phone || fetchedCustomer.mobileNumber || '',
            address: fetchedCustomer.address || '',
            dateOfBirth: fetchedCustomer.dateOfBirth || fetchedCustomer.dob || '',
          });
        } catch (err) {
          setError(err?.response?.data?.failureMessage || err?.message || 'Failed to fetch customer for editing.');
          console.error("Error in EditCustomer component:", err);
        } finally {
          setLoading(false);
        }
      };
      if (customer && customer.customerId) {
        fetchCustomer();
      } else {
        setError("No customer ID provided for editing.");
        setLoading(false);
      }
    }
  }, [customer]);

  const validateField = (name, value) => {
    switch (name) {
      case 'firstName':
        return validateName(value);
      case 'lastName':
        return validateName(value);
      case 'email':
        return validateEmail(value);
      case 'phone':
        return validateMobile(value);
      case 'address':
        return validateRequired(value, 'Address');
      case 'dateOfBirth':
        return validateDateOfBirth(value);
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));

    // Validate on change if field has been touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const value = form[name];
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(form).forEach(fieldName => {
      const error = validateField(fieldName, form[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPopup(null);
    setIsSubmitting(true);

    // Mark all fields as touched and validate
    const allTouched = {};
    Object.keys(form).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    if (!validateForm()) {
      // Don't show popup error, let the inline validation errors handle it
      setIsSubmitting(false);
      return;
    }

    try {
      const customerToUpdate = {
        ...form,
        customerId: customer.customerId,
        // Map phone to mobileNumber if backend expects mobileNumber
        mobileNumber: form.phone,
        // Map dateOfBirth to dob if backend expects dob
        dob: form.dateOfBirth,
      };

      console.log("Attempting to update customer with data:", customerToUpdate);
      await updateCustomer(customer.customerId, customerToUpdate);
      console.log("Customer updated successfully.");

      setPopup({ type: 'success', message: 'Customer updated successfully!' });

      setTimeout(() => {
        setPopup(null);
        onActionComplete();
      }, 1500);

    } catch (err) {
      console.error("Error updating customer:", err);
      let errorMessage = 'Failed to update customer.';
      if (err.response) {
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

  if (loading) {
    return <div className="edit-message">Loading customer details...</div>;
  }

  if (error) {
    return (
      <div className="edit-error-message">
        Error: {error}
        <button onClick={() => onActionComplete()} className="edit-back-button">
          Back to List
        </button>
      </div>
    );
  }

  return (
    <div className="edit-form">
      <h2 className="edit-title">Edit Customer</h2>

      {popup && (
        <div className={`popup ${popup.type}`}>
          {popup.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-group">
          <label>First Name</label>
          <input 
            type="text" 
            name="firstName" 
            value={form.firstName} 
            onChange={handleChange}
            onBlur={() => handleBlur('firstName')}
            className={errors.firstName ? 'error' : ''}
            required 
          />
          {errors.firstName && <span className="error-message">{errors.firstName}</span>}
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input 
            type="text" 
            name="lastName" 
            value={form.lastName} 
            onChange={handleChange}
            onBlur={() => handleBlur('lastName')}
            className={errors.lastName ? 'error' : ''}
            required 
          />
          {errors.lastName && <span className="error-message">{errors.lastName}</span>}
        </div>
        <div className="form-group">
          <label>Email</label>
          <input 
            type="email" 
            name="email" 
            value={form.email} 
            onChange={handleChange}
            onBlur={() => handleBlur('email')}
            className={errors.email ? 'error' : ''}
            required 
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input 
            type="tel" 
            name="phone" 
            value={form.phone} 
            onChange={handleChange}
            onBlur={() => handleBlur('phone')}
            className={errors.phone ? 'error' : ''}
            required 
          />
          {errors.phone && <span className="error-message">{errors.phone}</span>}
        </div>
        <div className="form-group">
          <label>Address</label>
          <input 
            type="text" 
            name="address" 
            value={form.address} 
            onChange={handleChange}
            onBlur={() => handleBlur('address')}
            className={errors.address ? 'error' : ''}
            required 
          />
          {errors.address && <span className="error-message">{errors.address}</span>}
        </div>
        <div className="form-group">
          <label>Date of Birth</label>
          <input 
            type="date" 
            name="dateOfBirth" 
            value={form.dateOfBirth} 
            onChange={handleChange}
            onBlur={() => handleBlur('dateOfBirth')}
            className={errors.dateOfBirth ? 'error' : ''}
            required 
          />
          {errors.dateOfBirth && <span className="error-message">{errors.dateOfBirth}</span>}
        </div>

        <div className="btn-row">
          <button type="submit" className="btn-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update Customer'}
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

export default EditCustomer;