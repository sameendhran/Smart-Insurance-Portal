import React from 'react';

// Optional hero wrapper for modular, additive enhancement
// Usage: place inside Login when desired; does not alter existing logic
export default function HeroLogin({ children, tagline = 'Secure Your Insurance in Minutes' }) {
  return (
    <div className="auth-container">
      <div className="auth-hero">
        <div className="auth-hero-text">
          <h1>{tagline}</h1>
          <p>Access your policies anytime, anywhere.</p>
        </div>
      </div>
      {children}
    </div>
  );
}


