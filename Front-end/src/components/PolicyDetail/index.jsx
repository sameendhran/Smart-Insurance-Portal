// src/components/PolicyDetail/index.jsx

import React, { useState, useEffect } from 'react';
import { getPolicyById, deletePolicy } from '../../services/policyService';
import './style.css';

function PolicyDetail({ policyId, onBack }) {
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchPolicyData();
  }, [policyId]);

  const fetchPolicyData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPolicyById(policyId);
      setPolicy(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch policy details.');
      console.error('Error fetching policy:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete policy: ${policy?.policyNumber}?`)) {
      try {
        setDeleting(true);
        await deletePolicy(policyId);
        alert('Policy deleted successfully!');
        if (onBack) {
          onBack();
        }
      } catch (err) {
        setError(err.message || 'Failed to delete policy.');
      } finally {
        setDeleting(false);
      }
    }
  };

  if (loading) {
    return <div className="policy-detail-loading">Loading policy details...</div>;
  }

  if (error) {
    return (
      <div className="policy-detail-error">
        Error: {error}
        <button onClick={onBack} className="policy-detail-back-button">
          Go Back
        </button>
      </div>
    );
  }

  if (!policy) {
    return (
      <div className="policy-detail-error">
        Policy not found.
        <button onClick={onBack} className="policy-detail-back-button">
          Go Back
        </button>
      </div>
    );
  }

  const renderField = (label, value) => {
    return (
      <div className="policy-detail-field">
        <label>{label}:</label>
        <span className="policy-detail-value">{value}</span>
      </div>
    );
  };

  return (
    <div className="policy-detail-container">
      <div className="policy-detail-header">
        <h2 className="policy-detail-title">Policy Details</h2>
        <div className="policy-detail-actions">
          <button 
            onClick={handleDelete} 
            className="policy-detail-delete-button"
            disabled={deleting}
          >
            {deleting ? '🗑️ Deleting...' : '🗑️ Delete'}
          </button>
          <button onClick={onBack} className="policy-detail-back-button">
            ← Back
          </button>
        </div>
      </div>

      <div className="policy-detail-content">
        <div className="policy-detail-grid">
          {renderField('Policy ID', policy.policyId)}
          {renderField('Policy Number', policy.policyNumber)}
          {renderField('Premium', `₹${policy.premium}`)}
          {renderField('Customer Name', policy.customerFullName || `${policy.customerFirstName} ${policy.customerLastName}`)}
          {renderField('Customer Mobile', policy.customerMobileNumber)}
          {renderField('Customer City', policy.customerCityName)}
          {renderField('Policy Type ID', policy.policyTypeId)}
          {renderField('Coverage ID', policy.coverageId)}
          {renderField('Created Date', policy.createdDate)}
          {renderField('Updated Date', policy.updatedDate)}
        </div>
      </div>
    </div>
  );
}

export default PolicyDetail; 