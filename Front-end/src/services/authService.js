// src/services/authService.js
import axios from 'axios';
import { getErrorMessage } from './apiUtils'; // Import getErrorMessage from your apiUtils

const API_AUTH_BASE_URL = 'http://localhost:8080/auth'; // Base URL for authentication endpoints

// Create a custom Axios instance for API calls that require authorization
// Other services (customerService, policyService) will use this instance.
const apiClient = axios.create({
    // ***************************************************************
    // IMPORTANT CHANGE: Adjust baseURL to include '/api'
    baseURL: 'http://localhost:8080/api', // This is the base for all your backend APIs (e.g., /api/customers)
    // ***************************************************************
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor: This automatically adds the JWT token to the Authorization header
// for every request made using `apiClient`.
apiClient.interceptors.request.use(
    config => {
        const token = localStorage.getItem('jwt_token'); // Correctly uses 'jwt_token'
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle authentication errors
apiClient.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response && error.response.status === 401) {
            // Clear invalid token
            localStorage.removeItem('jwt_token');
            console.log('Authentication failed, token cleared');
            // Optionally redirect to login
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// Function to handle user login
const login = async (username, password) => {
    try {
        console.log('Login attempt for username:', username);
        // Note: Login/Register calls use the direct axios instance, not apiClient,
        // because they don't require a token yet.
        const response = await axios.post(`${API_AUTH_BASE_URL}/login`, { username, password });
        console.log('Login response from backend:', response.data);
        
        // Backend returns a ResponseObject: { success: boolean, message: string, data: string (JWT) | null }
        if (response.data.success && response.data.data) {
            const jwtToken = response.data.data; // JWT is in the 'data' field
            console.log('Login successful, storing token');
            localStorage.setItem('jwt_token', jwtToken); // Store the token in local storage
            return { success: true, message: response.data.message || 'Login successful.', data: jwtToken }; // Return token in data field
        } else {
            // Backend's ResponseObject indicates failure
            console.log('Login failed:', response.data.message);
            return { success: false, message: response.data.message || 'Login failed: Invalid credentials or account not enabled.' };
        }
    } catch (error) {
        console.error('Login API error:', error.response || error);
        
        // Enhanced error logging for debugging
        if (error.code === 'ERR_NETWORK') {
            console.error('Network error - Backend server may not be running');
            console.error('Please ensure your Spring Boot backend is running on http://localhost:8080');
        }
        
        return { success: false, message: getErrorMessage(error) };
    }
};

// Function to handle user registration
const register = async (username, password, email) => {
    try {
        const response = await axios.post(`${API_AUTH_BASE_URL}/register`, { username, password, email });
        // Backend returns a ResponseObject: { success: boolean, message: string, data: null }
        if (response.data.success) {
            return { success: true, message: response.data.message || 'Registration successful. You can now log in.' };
        } else {
            // Backend's ResponseObject indicates failure
            return { success: false, message: response.data.message || 'Registration failed.' };
        }
    } catch (error) {
        console.error('Registration API error:', error.response || error);
        return { success: false, message: getErrorMessage(error) };
    }
};

// Function to log out a user (remove token from local storage)
const logout = () => {
    localStorage.removeItem('jwt_token');
    console.log('User logged out, token removed');
    // For a stateless JWT system, client-side token removal is typically sufficient.
};

// Function to check if a user is "authenticated" (i.e., has a token in local storage)
const isAuthenticated = () => {
    const token = localStorage.getItem('jwt_token');
    return !!token;
};

// Function to get the current token
const getToken = () => {
    return localStorage.getItem('jwt_token');
};

// Function to validate token (optional - you can add JWT validation here)
const validateToken = () => {
    const token = getToken();
    if (!token) return false;
    
    // Basic token validation - check if it's not empty and has proper format
    return token.length > 10 && token.includes('.');
};

// Function to check if backend server is accessible
// Treat HTTP 401/403 as "backend is up but protected" instead of "not accessible"
const checkBackendStatus = async () => {
    try {
        const response = await axios.get('http://localhost:8080/actuator/health', {
            timeout: 5000,
            validateStatus: () => true, // don't throw for non-2xx
        });
        return { accessible: true, status: response.status };
    } catch (error) {
        if (error && error.response) {
            // Backend responded (e.g., CORS preflight, 401, etc.) => server is reachable
            return { accessible: true, status: error.response.status };
        }
        console.error('Backend health check failed:', error?.message || error);
        return { accessible: false, error: error?.message || 'Unknown error' };
    }
};

// Export all relevant functions and the apiClient instance
export { login, register, logout, isAuthenticated, getToken, validateToken, checkBackendStatus, apiClient as default };