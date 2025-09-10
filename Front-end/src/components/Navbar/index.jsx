import React, { useState } from 'react';
import "./style.css"; // 'style.css' is in the same folder as 'index.jsx' // Add this for Navbar styling
import AdvancedSearchPanel from '../AdvancedSearchPanel';

function Navbar({ onNavigate, isAuthenticated, onLogout }) {
	const [showAdvanced, setShowAdvanced] = useState(false);
	return (
		<nav className="navbar navbar-relative">
			<div className="navbar-brand">
				<a href="#" onClick={() => onNavigate(isAuthenticated ? 'home' : 'login')}>
					Insurance App
				</a>
			</div>
			<ul className="navbar-nav">
				{isAuthenticated ? (
					<>
						<li><a href="#" onClick={() => onNavigate('home')}>Home</a></li>
						<li><a href="#" onClick={() => onNavigate('customer-list')}>Customers</a></li>
						<li><a href="#" onClick={() => onNavigate('add-customer')}>Add Customer</a></li>
						<li>
							<a href="#" onClick={(e) => { e.preventDefault(); setShowAdvanced((s) => !s); }}>Advanced Search</a>
						</li>
						<li><a href="#" onClick={() => onNavigate('policy-list')}>Policies</a></li>
						<li><a href="#" onClick={() => onNavigate('add-policy')}>Add Policy</a></li>
						<li><a href="#" onClick={() => onNavigate('debug')}>Debug</a></li>
						<li><button onClick={onLogout} className="nav-button">Logout</button></li>
					</>
				) : (
					<>
						<li><a href="#" onClick={() => onNavigate('login')}>Login</a></li>
						<li><a href="#" onClick={() => onNavigate('register')}>Register</a></li>
					</>
				)}
			</ul>
			{isAuthenticated && showAdvanced && (
				<AdvancedSearchPanel onNavigate={onNavigate} onClose={() => setShowAdvanced(false)} />
			)}
		</nav>
	);
}

export default Navbar;