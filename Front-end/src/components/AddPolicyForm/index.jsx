// src/components/AddPolicyForm/index.jsx

// Importing necessary React hooks and utility functions
import React, { useState, useEffect } from 'react';
import { createPolicy } from '../../services/policyService';
import { getAllCustomers } from '../../services/customerService';
import { getAllCoverages } from '../../services/coverageService';
import { getAllPolicyTypes } from '../../services/policyTypeService';
import { validatePremium, validateRequired } from '../../utils/validation';

import "./style.css";

// Main component to render the form for adding a new policy
const AddPolicyForm = ({ onPolicyAdded }) => {
    // State for form input values
    const [formData, setFormData] = useState({
        premium: '',
        coverageId: '',
        policyTypeId: '',
        customerId: ''
    });
    
    // State to handle validation errors, user interaction, data loading and success messages
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [customers, setCustomers] = useState([]);
    const [coverages, setCoverages] = useState([]);
    const [policyTypes, setPolicyTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Load initial dropdown data when the component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("Fetching initial form data (customers, coverages, policy types)...");
                const fetchedCustomers = await getAllCustomers();
                const fetchedCoverages = await getAllCoverages();
                const fetchedPolicyTypes = await getAllPolicyTypes();

                // Safely assign data only if it's a valid array
                setCustomers(Array.isArray(fetchedCustomers) ? fetchedCustomers : []);
                setCoverages(Array.isArray(fetchedCoverages) ? fetchedCoverages : []);
                setPolicyTypes(Array.isArray(fetchedPolicyTypes) ? fetchedPolicyTypes : []);
                console.log("Fetched Customers:", fetchedCustomers);
                console.log("Fetched Coverages:", fetchedCoverages);
                console.log("Fetched Policy Types:", fetchedPolicyTypes);

            } catch (err) {
                // Set error and fallback empty data on failure
                setError('Failed to load form data: ' + err.message);
                console.error('Error during initial data fetch:', err);
                setCustomers([]);
                setCoverages([]);
                setPolicyTypes([]);
            } finally {
                setLoading(false); // Always stop loading after fetch attempt
            }
        };
        fetchData();
    }, []);

    // Handle changes in form fields and validate as user types
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        validateField(name, value); // Perform real-time validation
    };

    // Handle when a field loses focus (mark as touched and validate)
    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        validateField(name, value);
    };

    // Validate a specific field based on name
    const validateField = (name, value) => {
        let error = '';

        switch (name) {
            case 'premium':
                error = validatePremium(value);
                break;
            case 'customerId':
                error = validateRequired(value, 'Customer');
                break;
            case 'coverageId':
                error = validateRequired(value, 'Coverage Type');
                break;
            case 'policyTypeId':
                error = validateRequired(value, 'Policy Type');
                break;
            default:
                break;
        }

        setErrors(prev => ({ ...prev, [name]: error }));
        return error;
    };

    // Validate the entire form before submission
    const validateForm = () => {
        const newErrors = {};
        let isValid = true;

        Object.keys(formData).forEach(fieldName => {
            const error = validateField(fieldName, formData[fieldName]);
            if (error) {
                newErrors[fieldName] = error;
                isValid = false;
            }
        });

        setErrors(newErrors);
        return isValid;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default browser behavior
        setError('');
        setSuccessMessage('');

        // Stop if validation fails
        if (!validateForm()) {
            setError('Please fix the validation errors before submitting.');
            return;
        }

        console.log('Attempting to add policy with formData:', formData);

        // Convert fields to correct types for backend
        const policyDataForBackend = {
            ...formData,
            premium: parseFloat(formData.premium),
            coverageId: parseInt(formData.coverageId),
            policyTypeId: parseInt(formData.policyTypeId),
            customerId: parseInt(formData.customerId)
        };
        
        // Check if converted fields are valid numbers
        if (isNaN(policyDataForBackend.coverageId) || isNaN(policyDataForBackend.policyTypeId) || 
            isNaN(policyDataForBackend.customerId) || isNaN(policyDataForBackend.premium)) {
            setError('Please select all required fields and enter a valid premium amount.');
            return;
        }
        
        console.log('Converted policy data for backend:', policyDataForBackend);

        try {
            // Create new policy through API
            const newPolicy = await createPolicy(policyDataForBackend);
            console.log('Policy created successfully:', newPolicy);

            // Show success and notify parent if needed
            setSuccessMessage('Policy added successfully! Policy Number: ' + newPolicy.policyNumber);
            if (onPolicyAdded) {
                onPolicyAdded(newPolicy);
            }

            // Reset form to initial state
            setFormData({
                premium: '',
                coverageId: '',
                policyTypeId: '',
                customerId: ''
            });
            setErrors({});
            setTouched({});
        } catch (err) {
            // Handle API errors gracefully
            console.error('Error caught in AddPolicyForm handleSubmit:', err);
            setError('Failed to add policy: ' + (err.message || "An unknown error occurred."));
        }
    };

    // Render a single input or dropdown field
    const renderField = (name, label, type = 'text', options = null) => {
        const hasError = touched[name] && errors[name];
        
        return (
            <div className={`form-group ${hasError ? 'error' : ''}`}>
                <label htmlFor={name}>{label}:</label>
                {type === 'select' ? (
                    <select
                        id={name}
                        name={name}
                        value={formData[name]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={hasError ? 'error' : ''}
                        required
                    >
                        <option value="">Select {label}</option>
                        {options?.map(option => (
                            <option key={option.customerId || option.coverageId || option.typeId} 
                                    value={option.customerId || option.coverageId || option.typeId}>
                                {option.firstName && option.lastName 
                                    ? `${option.firstName} ${option.lastName}`
                                    : option.coverageName || option.typeName}
                            </option>
                        ))}
                    </select>
                ) : (
                    <input
                        type={type}
                        id={name}
                        name={name}
                        value={formData[name]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={hasError ? 'error' : ''}
                        min={type === 'number' ? '1' : undefined}
                        step={type === 'number' ? '0.01' : undefined}
                        required
                    />
                )}
                {hasError && <span className="error-message">{errors[name]}</span>}
            </div>
        );
    };

    // Show loading state while fetching initial form data
    if (loading) return <div className="loading-message">Loading form data...</div>;

    // Render the full form UI
    return (
        <div className="add-policy-form-container">
            <h2>Add New Policy</h2>
            {error && <div className="error-message">{error}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}
            
            <form onSubmit={handleSubmit}>
                {renderField('customerId', 'Customer', 'select', customers)}
                {renderField('coverageId', 'Coverage Type', 'select', coverages)}
                {renderField('policyTypeId', 'Policy Type', 'select', policyTypes)}
                {renderField('premium', 'Premium Amount', 'number')}

                <button type="submit" className="submit-button">Add Policy</button>
            </form>
        </div>
    );
};

export default AddPolicyForm; // Exporting component for use in other parts of the app
