import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CustomerList from './components/CustomerList';
import AddCustomer from './components/AddCustomer';
import PolicyList from './components/PolicyList';
import AddPolicy from './components/AddPolicyForm';
import CustomerDetail from './components/CustomerDetail';
import PolicyDetail from './components/PolicyDetail';
import QueryInterface from './components/QueryInterface';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Debug from './components/Debug';
import { isAuthenticated as checkAuth, logout } from './services/authService';
import './App.css'; // Your main application styles (for global/layout)
// import './AuthForm.css'; // If you put AuthForm specific CSS here

function App() {
    // Initialize isAuthenticated based on token in localStorage
    const [isAuthenticated, setIsAuthenticated] = useState(checkAuth());
    // Initialize currentPage based on isAuthenticated status
    const [currentPage, setCurrentPage] = useState(() => {
        return checkAuth() ? 'home' : 'login';
    });
    // Add state for customer detail navigation
    const [customerDetailData, setCustomerDetailData] = useState({
        customerId: null,
        mode: 'view' // 'view' or 'edit'
    });
    // Add state for policy detail navigation
    const [policyDetailData, setPolicyDetailData] = useState({
        policyId: null
    });

    // Function to re-check authentication status and update state
    const updateAuthStatus = () => {
        const authStatus = checkAuth();
        setIsAuthenticated(authStatus);
        // You might also want to update the currentPage based on new auth status
        // For example, if token expires, force to login
        if (!authStatus && currentPage !== 'login' && currentPage !== 'register') {
             setCurrentPage('login');
        }
    };

    // Use an effect to periodically check auth status or when relevant events happen
    useEffect(() => {
        // This useEffect handles the initial load and any manual changes that aren't
        // caught by the explicit handleLoginSuccess/handleLogout.
        updateAuthStatus();
    }, []); // Runs once on component mount

    const handleNavigate = (page, data = null) => {
        if (page === 'customer-detail' && data) {
            setCustomerDetailData(data);
            setCurrentPage('customer-detail');
        } else if (page === 'policy-detail' && data) {
            setPolicyDetailData(data);
            setCurrentPage('policy-detail');
        } else {
            setCurrentPage(page);
            // Clear detail data when navigating away
            if (page !== 'customer-detail' && page !== 'policy-detail') {
                setCustomerDetailData({ customerId: null, mode: 'view' });
                setPolicyDetailData({ policyId: null });
            }
        }
    };

    const handleLoginSuccess = () => {
        updateAuthStatus(); // Update auth status after successful login
        setCurrentPage('home'); // Navigate to home page
    };

    const handleRegisterSuccess = () => {
        // No need to update isAuthenticated here, as account is pending approval.
        // The user will be redirected to login page by Register.jsx itself.
    };

    const handleLogout = () => {
        logout(); // Call the logout function from authService
        updateAuthStatus(); // Update auth status after logout
        setCurrentPage('login'); // Navigate to login page
    };

    const handleCustomerDetailBack = () => {
        setCurrentPage('customer-list');
        setCustomerDetailData({ customerId: null, mode: 'view' });
    };

    const handleCustomerDetailSave = () => {
        // Refresh customer list after save
        setCurrentPage('customer-list');
        setCustomerDetailData({ customerId: null, mode: 'view' });
    };

    const handlePolicyDetailBack = () => {
        setCurrentPage('policy-list');
        setPolicyDetailData({ policyId: null });
    };

    const renderContent = () => {
        if (!isAuthenticated) {
            switch (currentPage) {
                case 'register':
                    return <Register onNavigate={handleNavigate} onRegisterSuccess={handleRegisterSuccess} />;
                case 'login':
                default:
                    return <Login onLoginSuccess={handleLoginSuccess} onNavigate={handleNavigate} />;
            }
        } else {
            // If authenticated, show the main application content
            switch (currentPage) {
                case 'customer-list':
                    return <CustomerList onNavigate={handleNavigate} />;
                case 'add-customer':
                    return <AddCustomer onNavigate={handleNavigate} />;
                case 'policy-list':
                    return <PolicyList onNavigate={handleNavigate} />;
                case 'add-policy':
                    return <AddPolicy onNavigate={handleNavigate} />;
                case 'customer-detail':
                    return (
                        <CustomerDetail
                            customerId={customerDetailData.customerId}
                            mode={customerDetailData.mode}
                            onBack={handleCustomerDetailBack}
                            onSave={handleCustomerDetailSave}
                        />
                    );
                case 'policy-detail':
                    return (
                        <PolicyDetail
                            policyId={policyDetailData.policyId}
                            onBack={handlePolicyDetailBack}
                        />
                    );
                case 'query-interface':
                    return <QueryInterface onNavigate={handleNavigate} />;
                case 'debug':
                    return <Debug />;
                case 'home':
                default:
                    return <Home onNavigate={handleNavigate} />;
            }
        }
    };

    return (
        <div className="App">
            <Navbar
                onNavigate={handleNavigate}
                isAuthenticated={isAuthenticated}
                onLogout={handleLogout}
            />
            <main className="App-content">
                {renderContent()}
            </main>
        </div>
    );
}

export default App;