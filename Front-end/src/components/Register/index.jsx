import React, { useState } from 'react';
import { register } from "../../services/authService";
import "../AuthForm.css";

function Register({ onRegisterSuccess, onNavigate }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        try {
            console.log('Registration attempt for username:', username);
            const response = await register(username, password, email);
            console.log('Registration response:', response);

            if (response.success) {
                setSuccessMessage(response.message);
                // Redirect to login after successful registration
                setTimeout(() => {
                    onNavigate('login');
                }, 2000);
            } else {
                setErrorMessage(response.message);
            }
        } catch (error) {
            console.error('Registration failed:', error);
            setErrorMessage('An unexpected error occurred during registration. Please try again.');
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleRegister}>
                <h2>Register</h2>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>}
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
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                <button type="submit" className="auth-button">Register</button>
                <p>
                    Already have an account?{' '}
                    <a href="#" onClick={() => onNavigate('login')}>Login here</a>
                </p>
            </form>
        </div>
    );
}

export default Register;