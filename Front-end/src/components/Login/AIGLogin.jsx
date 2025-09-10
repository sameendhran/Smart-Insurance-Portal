// src/components/Login/AIGLogin.jsx
import React, { useEffect, useState } from 'react';
import { login, checkBackendStatus } from "../../services/authService";
import "./aig-login.css";

// Drop-in replacement for the existing Login component.
// Preserves props and backend integration: onLoginSuccess, onNavigate
function AIGLogin({ onLoginSuccess, onNavigate }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [backendStatus, setBackendStatus] = useState(null);

  useEffect(() => {
    const checkStatus = async () => {
      const status = await checkBackendStatus();
      setBackendStatus(status);
    };
    checkStatus();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    const response = await login(username, password);
    if (response.success && response.data) {
      onLoginSuccess();
    } else {
      setErrorMessage(response.message || "Login failed: Invalid credentials.");
    }
  };

  return (
    <div className="aig-login" role="main">
      <div className="aig-shell">
        {/* Hero Side */}
        <aside className="aig-hero" aria-hidden="false">
          <div className="aig-hero-overlay" />
          <div className="aig-hero-text">
            <h1>Secure Your Insurance in Minutes</h1>
            <p>Access your policies anytime, anywhere.</p>
          </div>
        </aside>

        {/* Form Side */}
        <section className="aig-panel" aria-labelledby="login-title">
          <div className="aig-form-card">
            <h2 id="login-title">Sign in to your account</h2>

            {backendStatus && !backendStatus.accessible && (
              <div className="aig-alert-warn">
                ⚠️ Backend server is not accessible. Please ensure your Spring Boot backend is running on http://localhost:8080
              </div>
            )}

            {errorMessage && (
              <div className="aig-alert-error">{errorMessage}</div>
            )}

            <form className="aig-form" onSubmit={handleLogin}>
              <div className="aig-field">
                <label htmlFor="aig-username">Email or Username</label>
                <input
                  id="aig-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="aig-field">
                <label htmlFor="aig-password">Password</label>
                <input
                  id="aig-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <button type="submit" className="aig-button">Login</button>

              <div className="aig-links">
                <a href="#">Forgot Password?</a>
                <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('register'); }}>Register</a>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AIGLogin;


