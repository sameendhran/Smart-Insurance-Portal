import React, { useState, useEffect } from 'react';
import { login, checkBackendStatus } from "../../services/authService";
import "../AuthForm.css";

function Login({ onLoginSuccess, onNavigate }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [backendStatus, setBackendStatus] = useState(null);

    // Check backend status when component mounts
    useEffect(() => {
        const checkStatus = async () => {
            const status = await checkBackendStatus();
            setBackendStatus(status);
        };
        checkStatus();
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage(''); // Clear previous errors

        try {
            console.log('Login attempt with username:', username);
            const response = await login(username, password); // 'response' is now directly { success: ..., message: ..., data: ... }
            console.log('Login response:', response); // Log 'response' directly, not 'response.data'

            // Corrected: Access properties directly on 'response'
            if (response.success && response.data) { // Check response.success and response.data for JWT
                console.log('Login successful, storing token');
                localStorage.setItem('jwt_token', response.data); // JWT is directly in response.data
                console.log('Token stored, calling onLoginSuccess');
                onLoginSuccess();
            } else {
                console.log('Login failed:', response.message);
                setErrorMessage(response.message || 'Login failed: Invalid credentials.'); // Access response.message
            }
        } catch (error) {
            console.error('Login failed:', error);
            // The authService.login already handles returning { success: false, message: error },
            // so this catch block might be redundant if the error handling in authService is robust.
            // However, keeping it for unexpected network errors or issues before authService returns.
            setErrorMessage('An unexpected error occurred during login. Please try again.');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-hero">
                <div className="auth-hero-graphics" aria-hidden="true">
                    <span role="img" aria-label="health">🏥</span>
                    <span role="img" aria-label="car">🚗</span>
                    <span role="img" aria-label="life">🛡️</span>
                </div>
                <div className="auth-hero-text">
                    <h1>Secure Your Future with Confidence</h1>
                    <p>Smart insurance solutions for every life stage.</p>
                </div>
            </div>
            <form className="auth-form" onSubmit={handleLogin}>
                <h2>Login</h2>

                {backendStatus && !backendStatus.accessible && (
                    <div className="backend-error-message">
                        ⚠️ Backend server is not accessible. Please ensure your Spring Boot backend is running on http://localhost:8080
                    </div>
                )}

                {errorMessage && <div className="error-message">{errorMessage}</div>}
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="auth-button">Login</button>
                <p>
                    Don't have an account?{' '}
                    <a href="#" onClick={() => onNavigate('register')}>Register here</a>
                </p>
            </form>
        </div>
    );
}

export default Login;