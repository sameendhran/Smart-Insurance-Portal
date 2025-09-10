// src/components/Home.jsx
import React from 'react';
import './style.css';

const Home = ({ onNavigate }) => {
	return (
		<div className="home-container">
			<h1>Welcome to the Insurance Management System!</h1>

			{/* Existing quick navigation */}
			<section className="home-quick-nav">
				<div className="home-navigation">
					<div className="nav-section">
						<h2>Customer Management</h2>
						<p className="nav-description">🗂️ View and manage all your customer details efficiently.</p>
						<div className="nav-buttons">
							<button onClick={() => onNavigate('customer-list')}>👥 Customer List</button>
							<button onClick={() => onNavigate('add-customer')}>➕ Add Customer</button>
						</div>
					</div>
					<div className="nav-section">
						<h2>Advanced Search</h2>
						<p className="nav-description">🔍 Run advanced filters like gender, date range, and policy type.</p>
						<div className="nav-buttons">
							<button onClick={() => onNavigate('query-interface')}>🔍 Advanced Search</button>
						</div>
					</div>
					<div className="nav-section">
						<h2>Policy Management</h2>
						<p className="nav-description">📄 Explore and maintain policy information and coverage.</p>
						<div className="nav-buttons">
							<button onClick={() => onNavigate('policy-list')}>📋 Policy List</button>
							<button onClick={() => onNavigate('add-policy')}>➕ Add Policy</button>
						</div>
					</div>
					<div className="nav-section">
						<h2>System</h2>
						<p className="nav-description">🛠️ Access tools for diagnostics and application status.</p>
						<div className="nav-buttons">
							<button onClick={() => onNavigate('debug')}>🛠️ Debug</button>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default Home;