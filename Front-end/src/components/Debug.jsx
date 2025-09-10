import React, { useState } from 'react';
import { login, isAuthenticated, getToken, validateToken } from '../services/authService';
import customerService from '../services/customerService';
import { createPolicy } from '../services/policyService';
import { getAllCoverages } from '../services/coverageService';
import { getAllPolicyTypes } from '../services/policyTypeService';

function Debug() {
    const [username, setUsername] = useState('testuser');
    const [password, setPassword] = useState('password');
    const [debugInfo, setDebugInfo] = useState('');

    const testLogin = async () => {
        try {
            setDebugInfo('Testing login...');
            const response = await login(username, password);
            setDebugInfo(`Login response: ${JSON.stringify(response, null, 2)}`);
        } catch (error) {
            setDebugInfo(`Login error: ${error.message}`);
        }
    };

    const checkAuth = () => {
        const auth = isAuthenticated();
        const token = getToken();
        const isValid = validateToken();
        setDebugInfo(`Is authenticated: ${auth}\nToken exists: ${!!token}\nToken valid: ${isValid}\nToken preview: ${token ? token.substring(0, 50) + '...' : 'None'}`);
    };

    const testCustomerAPI = async () => {
        try {
            setDebugInfo('Testing customer API...');
            const customers = await customerService.getAllCustomers();
            setDebugInfo(`Customer API response: ${JSON.stringify(customers, null, 2)}`);
        } catch (error) {
            setDebugInfo(`Customer API error: ${error.message}`);
        }
    };

    const clearToken = () => {
        localStorage.removeItem('jwt_token');
        setDebugInfo('Token cleared');
    };

    const testBackendConnection = async () => {
        try {
            setDebugInfo('Testing backend connection...');
            const response = await fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: 'testuser', password: 'wrongpassword' })
            });
            const data = await response.json();
            setDebugInfo(`Backend connection test: ${JSON.stringify(data, null, 2)}`);
        } catch (error) {
            setDebugInfo(`Backend connection error: ${error.message}`);
        }
    };

    const testCustomerAPIWithToken = async () => {
        try {
            const token = getToken();
            if (!token) {
                setDebugInfo('No token available. Please login first.');
                return;
            }

            setDebugInfo('Testing customer API with token...');
            const response = await fetch('http://localhost:8080/api/customers', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setDebugInfo(`Raw customer API response: ${JSON.stringify(data, null, 2)}`);
        } catch (error) {
            setDebugInfo(`Customer API with token error: ${error.message}`);
        }
    };

    const testCoverageAPI = async () => {
        try {
            setDebugInfo('Testing coverage API...');
            const coverages = await getAllCoverages();
            setDebugInfo(`Coverage API response: ${JSON.stringify(coverages, null, 2)}`);
        } catch (error) {
            setDebugInfo(`Coverage API error: ${error.message}`);
        }
    };

    const testPolicyTypeAPI = async () => {
        try {
            setDebugInfo('Testing policy type API...');
            const policyTypes = await getAllPolicyTypes();
            setDebugInfo(`Policy Type API response: ${JSON.stringify(policyTypes, null, 2)}`);
        } catch (error) {
            setDebugInfo(`Policy Type API error: ${error.message}`);
        }
    };

    const testPolicyCreation = async () => {
        try {
            setDebugInfo('Testing policy creation...');
            
            // First get some test data
            const customers = await customerService.getAllCustomers();
            const coverages = await getAllCoverages();
            const policyTypes = await getAllPolicyTypes();
            
            if (!customers || customers.length === 0) {
                setDebugInfo('No customers found. Cannot test policy creation.');
                return;
            }
            
            if (!coverages || coverages.length === 0) {
                setDebugInfo('No coverages found. Cannot test policy creation.');
                return;
            }
            
            if (!policyTypes || policyTypes.length === 0) {
                setDebugInfo('No policy types found. Cannot test policy creation.');
                return;
            }
            
            // Use the first available data for testing
            const testPolicyData = {
                premium: 1000.0,
                coverageId: coverages[0].coverageId,
                policyTypeId: policyTypes[0].typeId,
                customerId: customers[0].customerId
            };
            
            setDebugInfo(`Testing policy creation with data: ${JSON.stringify(testPolicyData, null, 2)}`);
            
            const newPolicy = await createPolicy(testPolicyData);
            setDebugInfo(`Policy creation successful: ${JSON.stringify(newPolicy, null, 2)}`);
        } catch (error) {
            setDebugInfo(`Policy creation error: ${error.message}`);
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'monospace' }}>
            <h2>Debug Panel</h2>
            
            <div style={{ marginBottom: '20px' }}>
                <h3>Test Login</h3>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{ marginRight: '10px' }}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ marginRight: '10px' }}
                />
                <button onClick={testLogin}>Test Login</button>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <h3>Auth Status</h3>
                <button onClick={checkAuth}>Check Auth</button>
                <button onClick={clearToken} style={{ marginLeft: '10px' }}>Clear Token</button>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <h3>API Tests</h3>
                <button onClick={testCustomerAPI}>Test Customer API (Service)</button>
                <button onClick={testCustomerAPIWithToken} style={{ marginLeft: '10px' }}>Test Customer API (Raw)</button>
                <button onClick={testBackendConnection} style={{ marginLeft: '10px' }}>Test Backend Connection</button>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <h3>Policy Creation Tests</h3>
                <button onClick={testCoverageAPI}>Test Coverage API</button>
                <button onClick={testPolicyTypeAPI} style={{ marginLeft: '10px' }}>Test Policy Type API</button>
                <button onClick={testPolicyCreation} style={{ marginLeft: '10px' }}>Test Policy Creation</button>
            </div>

            <div style={{ marginTop: '20px' }}>
                <h3>Debug Output</h3>
                <pre style={{ 
                    backgroundColor: '#f5f5f5', 
                    padding: '10px', 
                    border: '1px solid #ccc',
                    whiteSpace: 'pre-wrap',
                    maxHeight: '400px',
                    overflow: 'auto'
                }}>
                    {debugInfo}
                </pre>
            </div>

            <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#e8f4f8', border: '1px solid #ccc' }}>
                <h4>Instructions:</h4>
                <ol>
                    <li>First, try "Test Backend Connection" to verify the backend is running</li>
                    <li>Use "Check Auth" to see current authentication status</li>
                    <li>Try logging in with test credentials (you may need to register first)</li>
                    <li>After successful login, test the Customer API</li>
                    <li>Use "Test Customer API (Raw)" to see the exact backend response</li>
                    <li>Test Coverage API and Policy Type API to ensure data is available</li>
                    <li>Finally, test Policy Creation with the first available data</li>
                </ol>
            </div>
        </div>
    );
}

export default Debug; 