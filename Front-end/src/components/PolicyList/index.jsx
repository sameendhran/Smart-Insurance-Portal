import React, { useEffect, useState } from 'react';
import { getAllPolicies, deletePolicy } from '../../services/policyService';
import ToastNotification from '../ToastNotification';
import './style.css';

// A simple dialog component to replace window.confirm and alert
const ConfirmationDialog = ({ message, onConfirm, onCancel }) => {
    return (
        <div className="policy-detail-dialog-overlay">
            <div className="policy-detail-dialog-box">
                <p>{message}</p>
                <div className="policy-detail-dialog-actions">
                    <button onClick={onConfirm} className="dialog-button-confirm">Confirm</button>
                    <button onClick={onCancel} className="dialog-button-cancel">Cancel</button>
                </div>
            </div>
        </div>
    );
};

function PolicyList({ onNavigate }) {
    const [policies, setPolicies] = useState([]);
    const [filteredPolicies, setFilteredPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showNoResultsToast, setShowNoResultsToast] = useState(false);
    const [showNoResultsModal, setShowNoResultsModal] = useState(false);
    // New state for handling delete functionality
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [policyToDelete, setPolicyToDelete] = useState(null);
    const [deletingPolicyId, setDeletingPolicyId] = useState(null);

    useEffect(() => {
        fetchPolicies();
    }, []);

    useEffect(() => {
        // Filter policies based on search term
        if (searchTerm.trim() === '') {
            setFilteredPolicies(policies);
            setShowNoResultsToast(false);
        } else {
            const filtered = policies.filter(policy => {
                const customerFullName = policy.customerFullName || `${policy.customerFirstName || ''} ${policy.customerLastName || ''}`.trim();
                return (
                    policy.policyNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    customerFullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    policy.customerFirstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    policy.customerLastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    policy.customerMobileNumber?.includes(searchTerm) ||
                    policy.customerCityName?.toLowerCase().includes(searchTerm.toLowerCase())
                );
            });
            setFilteredPolicies(filtered);

            // Show modal (and hide toast) if no results found
            if (filtered.length === 0 && policies.length > 0) {
                setShowNoResultsModal(true);
                setShowNoResultsToast(false);
            } else {
                setShowNoResultsModal(false);
                setShowNoResultsToast(false);
            }
        }
    }, [searchTerm, policies]);

    const fetchPolicies = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAllPolicies();
            if (Array.isArray(data)) {
                setPolicies(data);
                setFilteredPolicies(data);
            } else {
                console.warn("PolicyList: Received non-array data:", data);
                setPolicies([]);
                setFilteredPolicies([]);
            }
        } catch (err) {
            setError(err.message || 'Failed to fetch policies.');
            console.error("Error in PolicyList component:", err);
            setPolicies([]);
            setFilteredPolicies([]);
        } finally {
            setLoading(false);
        }
    };

    const handleViewPolicy = (policy) => {
        onNavigate('policy-detail', {
            policyId: policy.policyId
        });
    };
    
    // HANDLER: Sets the policy to be deleted and shows the confirmation modal
    const handleDeleteClick = (policy) => {
        setPolicyToDelete(policy);
        setShowConfirmModal(true);
    };

    // ASYNC HANDLER: Performs the actual deletion after confirmation
    const handleDeleteConfirm = async () => {
        if (!policyToDelete) return;

        setShowConfirmModal(false);
        setDeletingPolicyId(policyToDelete.policyId);

        try {
            await deletePolicy(policyToDelete.policyId);
            // Refresh the policy list after successful deletion
            await fetchPolicies();
        } catch (err) {
            setError(err.message || 'Failed to delete policy.');
            console.error("Error deleting policy:", err);
        } finally {
            setDeletingPolicyId(null);
            setPolicyToDelete(null);
        }
    };

    // HANDLER: Closes the confirmation modal
    const handleDeleteCancel = () => {
        setShowConfirmModal(false);
        setPolicyToDelete(null);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    if (loading) {
        return (
            <div className="policy-message">Loading policies...</div>
        );
    }

    if (error) {
        return (
            <div className="policy-error-message">
                Error: {error}
                <button
                    onClick={fetchPolicies}
                    className="policy-retry-button"
                >
                    Retry
                </button>
            </div>
        );
    }

    const policiesArray = Array.isArray(filteredPolicies) ? filteredPolicies : [];

    return (
        <div className="policy-list-container">
            <div className="policy-list-header-row">
                <h2 className="policy-list-title">Policy List</h2>
                <div className="policy-search-container">
                    <input
                        type="text"
                        placeholder="Search policies by number, customer name, mobile, or city..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="policy-search-input"
                    />
                    <span className="policy-count">
                        {policiesArray.length} of {policies.length} policies
                    </span>
                </div>
            </div>

            {policiesArray.length === 0 ? (
                <p className="policy-message">
                    {searchTerm ? 'No policies found matching your search.' : 'No policies found. Add a new one!'}
                </p>
            ) : (
                <div className="policy-table-wrapper">
                    <table className="policy-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Policy No.</th>
                                <th>Premium</th>
                                <th>Customer Name</th>
                                <th>Customer Mobile</th>
                                <th>Customer City</th>
                                <th>Policy Type ID</th>
                                <th>Coverage ID</th>
                                <th>Created Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {policiesArray.map((policy) => (
                                <tr key={policy.policyId}>
                                    <td>{policy.policyId}</td>
                                    <td>{policy.policyNumber}</td>
                                    <td>₹{policy.premium}</td>
                                    <td>
                                        {policy.customerFullName || `${policy.customerFirstName || ''} ${policy.customerLastName || ''}`.trim()}
                                    </td>
                                    <td>{policy.customerMobileNumber}</td>
                                    <td>{policy.customerCityName}</td>
                                    <td>{policy.policyTypeId}</td>
                                    <td>{policy.coverageId}</td>
                                    <td>{policy.createdDate}</td>
                                    <td className="policy-actions-cell">
                                        <button
                                            className="policy-view-button"
                                            onClick={() => handleViewPolicy(policy)}
                                            title="View Policy"
                                        >
                                            👁️
                                        </button>
                                        <button
                                            className="policy-delete-button"
                                            onClick={() => handleDeleteClick(policy)}
                                            title="Delete Policy"
                                            disabled={deletingPolicyId === policy.policyId}
                                        >
                                            {deletingPolicyId === policy.policyId ? '🗑️ Deleting...' : '🗑️'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* CONDITIONAL RENDERING: Display the custom dialog when requested */}
            {showConfirmModal && policyToDelete && (
                <ConfirmationDialog
                    message={`Are you sure you want to delete policy: ${policyToDelete.policyNumber}?`}
                    onConfirm={handleDeleteConfirm}
                    onCancel={handleDeleteCancel}
                />
            )}

            {/* Modal for No Search Results */}
            {showNoResultsModal && (
                <div className="no-results-modal-overlay" role="dialog" aria-modal="true">
                    <div className="no-results-modal">
                        <div className="no-results-modal-header">
                            <h3>No Results</h3>
                            <button
                                className="no-results-modal-close"
                                onClick={() => setShowNoResultsModal(false)}
                                aria-label="Close"
                            >
                                ×
                            </button>
                        </div>
                        <div className="no-results-modal-content">
                            <p>No products found. Please try a different search term.</p>
                            <button
                                className="no-results-modal-ok"
                                onClick={() => setShowNoResultsModal(false)}
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Toast Notification for No Search Results (kept for other callers if needed) */}
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

export default PolicyList;
