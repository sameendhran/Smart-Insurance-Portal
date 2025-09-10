import React from 'react';

// Hero section with gradient background and hero image
// Uses CSS variables for easy theming: --home-hero-image, --brand-primary
export default function Hero({ onNavigate, tagline = 'Manage Your Policies Effortlessly' }) {
  return (
    <section className="hm-hero">
      <div className="hm-hero-inner">
        <div className="hm-hero-copy">
          <h1>{tagline}</h1>
          <p>Your insurance, your control. View policies, manage customers, and make claims in one place.</p>
          <div className="hm-cta">
            <button className="hm-btn hm-btn-primary" onClick={() => onNavigate('login')}>Get Started</button>
            <button className="hm-btn" onClick={() => onNavigate('register')}>Login / Register</button>
          </div>
        </div>
        <div className="hm-hero-visual" aria-hidden="true" />
      </div>
    </section>
  );
}


