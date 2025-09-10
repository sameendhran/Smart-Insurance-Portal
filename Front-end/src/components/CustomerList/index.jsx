// src/main/frontend/src/pages/CustomerList/index.jsx
// This is the full updated code for your CustomerList component.

import React, { useState, useEffect } from 'react';
import { getAllCustomers } from '../../services/customerService'; 
import { isAuthenticated } from '../../services/authService';
import ToastNotification from '../ToastNotification';
import './style.css';

function CustomerList({ onNavigate }) {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNoResultsToast, setShowNoResultsToast] = useState(false);

  useEffect(() => {
    // Check authentication first
    if (!isAuthenticated()) {
      console.log("CustomerList: User not authenticated, redirecting to login");
      onNavigate('login');
      return;
    }
    
    fetchCustomers();
  }, [onNavigate]);

  useEffect(() => {
    // Filter customers based on search term
    if (searchTerm.trim() === '') {
      setFilteredCustomers(customers);
      setShowNoResultsToast(false);
    } else {
      const filtered = customers.filter(customer => 
        customer.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.mobileNumber?.includes(searchTerm) ||
        customer.cityName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.gender?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCustomers(filtered);
      
      // Show toast notification if no results found
      if (filtered.length === 0 && customers.length > 0) {
        setShowNoResultsToast(true);
      } else {
        setShowNoResultsToast(false);
      }
    }
  }, [searchTerm, customers]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("CustomerList: Starting to fetch customers...");
      
      // Double-check authentication
      if (!isAuthenticated()) {
        setError('Authentication required. Please log in.');
        setCustomers([]);
        setFilteredCustomers([]);
        onNavigate('login');
        return;
      }
      
      const data = await getAllCustomers();
      console.log("CustomerList: Received data from service:", data);
      
      if (Array.isArray(data)) {
        console.log("CustomerList: Data is array, length:", data.length);
        setCustomers(data);
        setFilteredCustomers(data);
      } else {
        console.warn("CustomerList: Received non-array data:", data);
        setCustomers([]);
        setFilteredCustomers([]);
      }
    } catch (err) {
      console.error("Error in CustomerList component:", err);
      if (err.message && err.message.includes('Authentication required')) {
        setError('Session expired. Please log in again.');
        // Redirect to login
        onNavigate('login');
      } else if (err.message && err.message.includes('Request failed')) {
        setError('Network error. Please check if the backend is running and try again.');
      } else {
        setError(err.message || 'Failed to fetch customers.'); 
      }
      setCustomers([]);
      setFilteredCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewCustomer = (customer) => {
    // Navigate to customer detail page in view mode
    onNavigate('customer-detail', {
      customerId: customer.customerId,
      mode: 'view'
    });
  };

  const handleEditCustomer = (customer) => {
    // Navigate to customer detail page in edit mode
    onNavigate('customer-detail', {
      customerId: customer.customerId,
      mode: 'edit'
    });
  };



  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // If not authenticated, don't render anything (will redirect to login)
  if (!isAuthenticated()) {
    return null;
  }

  if (loading) {
    return (
      <div className="customer-message">Loading customers...</div>
    );
  }

  if (error) {
    return (
      <div className="customer-error-message">
        Error: {error}
        <button
          onClick={fetchCustomers}
          className="customer-retry-button"
        >
          Retry
        </button>
        {error.includes('Authentication') && (
          <button
            onClick={() => onNavigate('login')}
            className="customer-login-button"
            style={{ marginLeft: '10px' }}
          >
            Go to Login
          </button>
        )}
        {error.includes('Network error') && (
          <button
            onClick={() => onNavigate('debug')}
            className="customer-debug-button"
            style={{ marginLeft: '10px' }}
          >
            Debug
          </button>
        )}
      </div>
    );
  }

  const customersArray = Array.isArray(filteredCustomers) ? filteredCustomers : [];

  return (
    <div className="customer-list-container">
      <div className="customer-list-header-row">
        <h2 className="customer-list-title">Customer List</h2>
        <div className="customer-search-container">
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="customer-search-input"
          />
          <span className="customer-count">
            {customersArray.length} of {customers.length} customers
          </span>
        </div>
      </div>

      {customersArray.length === 0 ? (
        <p className="customer-message">
          {searchTerm ? 'No customers found matching your search.' : 'No customers found. Add a new one!'}
        </p>
      ) : (
        <div className="customer-table-wrapper">
          <table className="customer-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Gender</th>
                <th>Date of Birth</th>
                <th>Mobile Number</th>
                <th>City</th>
                <th>State ID</th>
                <th>Country ID</th>
                <th>Occupation ID</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customersArray.map(customer => (
                <tr key={customer.customerId}>
                  <td>{customer.customerId}</td>
                  <td>{customer.firstName}</td>
                  <td>{customer.lastName}</td>
                  <td>{customer.gender}</td>
                  <td>{customer.dob}</td>
                  <td>{customer.mobileNumber}</td>
                  <td>{customer.cityName}</td>
                  <td>{customer.stateId}</td>
                  <td>{customer.countryId}</td>
                  <td>{customer.occupationId}</td>
                  <td>{customer.createdDate}</td>
                  <td className="customer-actions-cell">
                    <button
                      className="customer-view-button"
                      onClick={() => handleViewCustomer(customer)}
                      title="View Customer"
                    >
                      👁️
                    </button>
                    <button
                      className="customer-edit-button"
                      onClick={() => handleEditCustomer(customer)}
                      title="Edit Customer"
                    >
                      ✏️
                    </button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

export default CustomerList;