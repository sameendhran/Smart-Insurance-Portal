// src/components/QueryInterface/index.jsx

import React, { useState, useEffect } from 'react';
import { getAllPolicies, getPoliciesByGender, getPoliciesByDateRange } from '../../services/policyService';
import { getAllCustomers } from '../../services/customerService';
import { getAllCities } from '../../services/cityService';
import { getAllPolicyTypes } from '../../services/policyTypeService';
import { getAllCoverages } from '../../services/coverageService';
import ToastNotification from '../ToastNotification';
import './style.css';

const QueryInterface = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('policy');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [cities, setCities] = useState([]);
  const [policyTypes, setPolicyTypes] = useState([]);
  const [coverages, setCoverages] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [showNoResultsToast, setShowNoResultsToast] = useState(false);

  // Form states for different queries
  const [queryParams, setQueryParams] = useState({
    // Policy queries
    customerId: '',
    premium: '',
    startDate: '',
    endDate: '',
    customerName: '',
    customerGender: '',
    cityName: '',
    
    // Customer queries
    customerCityName: '',
    birthDate: '',
    premiumAmount: '',
    policyTypeName: '',
    occupationId: '',
    birthAfterDate: '',
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [citiesData, policyTypesData, coveragesData, customersData, policiesData] = await Promise.all([
        getAllCities(),
        getAllPolicyTypes(),
        getAllCoverages(),
        getAllCustomers(),
        getAllPolicies()
      ]);

      setCities(citiesData || []);
      setPolicyTypes(policyTypesData || []);
      setCoverages(coveragesData || []);
      setCustomers(customersData || []);
      setPolicies(policiesData || []);
    } catch (err) {
      setError('Failed to load initial data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleParamChange = (param, value) => {
    setQueryParams(prev => ({
      ...prev,
      [param]: value
    }));
  };

  const executeQuery = async (queryType) => {
    setLoading(true);
    setError(null);
    setResults([]);

    try {
      let queryResults = [];

      switch (queryType) {
        // Policy Queries
        case 'policiesByCustomer':
          if (!queryParams.customerId) {
            setError('Please enter a Customer ID');
            return;
          }
          queryResults = policies.filter(p => p.customerId === parseInt(queryParams.customerId));
          break;

        case 'policiesByPremium':
          if (!queryParams.premium) {
            setError('Please enter a premium amount');
            return;
          }
          queryResults = policies.filter(p => p.premium > parseFloat(queryParams.premium));
          break;

        case 'policiesByDateRange':
          if (!queryParams.startDate || !queryParams.endDate) {
            setError('Please select both start and end dates');
            return;
          }
          queryResults = await getPoliciesByDateRange(queryParams.startDate, queryParams.endDate);
          break;

        case 'policiesByCustomerName':
          if (!queryParams.customerName) {
            setError('Please enter a customer name');
            return;
          }
          queryResults = policies.filter(p => 
            p.customerFirstName?.toLowerCase().includes(queryParams.customerName.toLowerCase()) ||
            p.customerLastName?.toLowerCase().includes(queryParams.customerName.toLowerCase())
          );
          break;

        case 'policiesByGender':
          if (!queryParams.customerGender) {
            setError('Please select a gender');
            return;
          }
          queryResults = await getPoliciesByGender(queryParams.customerGender);
          break;

        case 'policiesByCity':
          if (!queryParams.cityName) {
            setError('Please select a city');
            return;
          }
          queryResults = policies.filter(p => 
            p.customerCityName?.toLowerCase() === queryParams.cityName.toLowerCase()
          );
          break;

        case 'allPoliciesWithDetails':
          queryResults = policies;
          break;

        case 'policiesBasicInfo':
          queryResults = policies.map(p => ({
            policyId: p.policyId,
            policyNumber: p.policyNumber,
            premium: p.premium,
            policyTypeName: p.policyTypeName || 'N/A'
          }));
          break;

        case 'totalPolicies':
          queryResults = [{ count: policies.length }];
          break;

        case 'sumPremiums':
          const totalPremium = policies.reduce((sum, p) => sum + (p.premium || 0), 0);
          queryResults = [{ totalPremium }];
          break;

        case 'policiesByCityCount':
          const cityCounts = {};
          policies.forEach(p => {
            const city = p.customerCityName || 'Unknown';
            cityCounts[city] = (cityCounts[city] || 0) + 1;
          });
          queryResults = Object.entries(cityCounts).map(([city, count]) => ({ city, count }));
          break;

        // Customer Queries
        case 'customersByCity':
          if (!queryParams.customerCityName) {
            setError('Please select a city');
            return;
          }
          queryResults = customers.filter(c => 
            c.cityName?.toLowerCase() === queryParams.customerCityName.toLowerCase()
          );
          break;

        case 'customersByGender':
          if (!queryParams.customerGender) {
            setError('Please select a gender');
            return;
          }
          queryResults = customers.filter(c => c.gender === queryParams.customerGender);
          break;

        case 'customersBornBefore':
          if (!queryParams.birthDate) {
            setError('Please select a date');
            return;
          }
          const cutoffDate = new Date(queryParams.birthDate);
          queryResults = customers.filter(c => {
            const birthDate = new Date(c.dob);
            return birthDate < cutoffDate;
          });
          break;

        case 'customersInCityCount':
          if (!queryParams.customerCityName) {
            setError('Please select a city');
            return;
          }
          const count = customers.filter(c => 
            c.cityName?.toLowerCase() === queryParams.customerCityName.toLowerCase()
          ).length;
          queryResults = [{ city: queryParams.customerCityName, count }];
          break;

        case 'customersWithPremiumAbove':
          if (!queryParams.premiumAmount) {
            setError('Please enter a premium amount');
            return;
          }
          const customerIdsWithHighPremium = new Set();
          policies.forEach(p => {
            if (p.premium > parseFloat(queryParams.premiumAmount)) {
              customerIdsWithHighPremium.add(p.customerId);
            }
          });
          queryResults = customers.filter(c => customerIdsWithHighPremium.has(c.customerId));
          break;

        case 'customersByPolicyType':
          if (!queryParams.policyTypeName) {
            setError('Please select a policy type');
            return;
          }
          {
            const { getCustomersByPolicyType } = await import('../../services/customerService');
            queryResults = await getCustomersByPolicyType(queryParams.policyTypeName);
          }
          break;

        case 'customersByOccupation':
          if (!queryParams.occupationId) {
            setError('Please enter an occupation ID');
            return;
          }
          queryResults = customers.filter(c => c.occupationId === parseInt(queryParams.occupationId));
          break;

        case 'customersBornAfter':
          if (!queryParams.birthAfterDate) {
            setError('Please select a date');
            return;
          }
          const afterDate = new Date(queryParams.birthAfterDate);
          queryResults = customers.filter(c => {
            const birthDate = new Date(c.dob);
            return birthDate > afterDate;
          });
          break;

        case 'customersWithNoPolicies':
          const customerIdsWithPolicies = new Set(policies.map(p => p.customerId));
          queryResults = customers.filter(c => !customerIdsWithPolicies.has(c.customerId));
          break;

        default:
          setError('Unknown query type');
          return;
      }

      setResults(queryResults);
      
      // Show toast notification if no results found
      if ((Array.isArray(queryResults) && queryResults.length === 0) || (!Array.isArray(queryResults) && !queryResults)) {
        setShowNoResultsToast(true);
      } else {
        setShowNoResultsToast(false);
      }
    } catch (err) {
      setError('Error executing query: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderPolicyQueries = () => (
    <div className="query-section">
      <h3>Policy Queries</h3>
      
      <div className="query-group">
        <h4>Find Policies by Customer ID</h4>
        <div className="query-inputs">
          <input
            type="number"
            placeholder="Customer ID"
            value={queryParams.customerId}
            onChange={(e) => handleParamChange('customerId', e.target.value)}
          />
          <button onClick={() => executeQuery('policiesByCustomer')}>Execute</button>
        </div>
      </div>

      <div className="query-group">
        <h4>Find Policies with Premium Greater Than</h4>
        <div className="query-inputs">
          <input
            type="number"
            placeholder="Premium Amount"
            value={queryParams.premium}
            onChange={(e) => handleParamChange('premium', e.target.value)}
          />
          <button onClick={() => executeQuery('policiesByPremium')}>Execute</button>
        </div>
      </div>

      <div className="query-group">
        <h4>Find Policies by Date Range</h4>
        <div className="query-inputs">
          <input
            type="date"
            value={queryParams.startDate}
            onChange={(e) => handleParamChange('startDate', e.target.value)}
          />
          <input
            type="date"
            value={queryParams.endDate}
            onChange={(e) => handleParamChange('endDate', e.target.value)}
          />
          <button onClick={() => executeQuery('policiesByDateRange')}>Execute</button>
        </div>
      </div>

      <div className="query-group">
        <h4>Find Policies by Customer Name</h4>
        <div className="query-inputs">
          <input
            type="text"
            placeholder="Customer Name"
            value={queryParams.customerName}
            onChange={(e) => handleParamChange('customerName', e.target.value)}
          />
          <button onClick={() => executeQuery('policiesByCustomerName')}>Execute</button>
        </div>
      </div>

      <div className="query-group">
        <h4>Find Policies by Customer Gender</h4>
        <div className="query-inputs">
          <select
            value={queryParams.customerGender}
            onChange={(e) => handleParamChange('customerGender', e.target.value)}
          >
            <option value="">Select Gender</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
            <option value="Other">Other</option>
          </select>
          <button onClick={() => executeQuery('policiesByGender')}>Execute</button>
        </div>
      </div>

      <div className="query-group">
        <h4>Find Policies by Customer City</h4>
        <div className="query-inputs">
          <select
            value={queryParams.cityName}
            onChange={(e) => handleParamChange('cityName', e.target.value)}
          >
            <option value="">Select City</option>
            {cities.map(city => (
              <option key={city.cityId} value={city.cityName}>
                {city.cityName}
              </option>
            ))}
          </select>
          <button onClick={() => executeQuery('policiesByCity')}>Execute</button>
        </div>
      </div>

      <div className="query-group">
        <h4>Aggregate Queries</h4>
        <div className="query-buttons">
          <button onClick={() => executeQuery('allPoliciesWithDetails')}>
            All Policies with Details
          </button>
          <button onClick={() => executeQuery('policiesBasicInfo')}>
            Basic Policy Info
          </button>
          <button onClick={() => executeQuery('totalPolicies')}>
            Total Policies Count
          </button>
          <button onClick={() => executeQuery('sumPremiums')}>
            Sum All Premiums
          </button>
          <button onClick={() => executeQuery('policiesByCityCount')}>
            Policies Count by City
          </button>
        </div>
      </div>
    </div>
  );

  const renderCustomerQueries = () => (
    <div className="query-section">
      <h3>Customer Queries</h3>
      
      <div className="query-group">
        <h4>Find Customers by City</h4>
        <div className="query-inputs">
          <select
            value={queryParams.customerCityName}
            onChange={(e) => handleParamChange('customerCityName', e.target.value)}
          >
            <option value="">Select City</option>
            {cities.map(city => (
              <option key={city.cityId} value={city.cityName}>
                {city.cityName}
              </option>
            ))}
          </select>
          <button onClick={() => executeQuery('customersByCity')}>Execute</button>
        </div>
      </div>

      <div className="query-group">
        <h4>Find Customers by Gender</h4>
        <div className="query-inputs">
          <select
            value={queryParams.customerGender}
            onChange={(e) => handleParamChange('customerGender', e.target.value)}
          >
            <option value="">Select Gender</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
            <option value="Other">Other</option>
          </select>
          <button onClick={() => executeQuery('customersByGender')}>Execute</button>
        </div>
      </div>

      <div className="query-group">
        <h4>Find Customers Born Before Date</h4>
        <div className="query-inputs">
          <input
            type="date"
            value={queryParams.birthDate}
            onChange={(e) => handleParamChange('birthDate', e.target.value)}
          />
          <button onClick={() => executeQuery('customersBornBefore')}>Execute</button>
        </div>
      </div>

      <div className="query-group">
        <h4>Count Customers in City</h4>
        <div className="query-inputs">
          <select
            value={queryParams.customerCityName}
            onChange={(e) => handleParamChange('customerCityName', e.target.value)}
          >
            <option value="">Select City</option>
            {cities.map(city => (
              <option key={city.cityId} value={city.cityName}>
                {city.cityName}
              </option>
            ))}
          </select>
          <button onClick={() => executeQuery('customersInCityCount')}>Execute</button>
        </div>
      </div>

      <div className="query-group">
        <h4>Find Customers with Premium Above</h4>
        <div className="query-inputs">
          <input
            type="number"
            placeholder="Premium Amount"
            value={queryParams.premiumAmount}
            onChange={(e) => handleParamChange('premiumAmount', e.target.value)}
          />
          <button onClick={() => executeQuery('customersWithPremiumAbove')}>Execute</button>
        </div>
      </div>

      <div className="query-group">
        <h4>Find Customers by Policy Type</h4>
        <div className="query-inputs">
          <select
            value={queryParams.policyTypeName}
            onChange={(e) => handleParamChange('policyTypeName', e.target.value)}
          >
            <option value="">Select Policy Type</option>
            {policyTypes.map(type => (
              <option key={type.policyTypeId} value={type.typeName}>
                {type.typeName}
              </option>
            ))}
          </select>
          <button onClick={() => executeQuery('customersByPolicyType')}>Execute</button>
        </div>
      </div>

      <div className="query-group">
        <h4>Find Customers by Occupation ID</h4>
        <div className="query-inputs">
          <input
            type="number"
            placeholder="Occupation ID"
            value={queryParams.occupationId}
            onChange={(e) => handleParamChange('occupationId', e.target.value)}
          />
          <button onClick={() => executeQuery('customersByOccupation')}>Execute</button>
        </div>
      </div>

      <div className="query-group">
        <h4>Find Customers Born After Date</h4>
        <div className="query-inputs">
          <input
            type="date"
            value={queryParams.birthAfterDate}
            onChange={(e) => handleParamChange('birthAfterDate', e.target.value)}
          />
          <button onClick={() => executeQuery('customersBornAfter')}>Execute</button>
        </div>
      </div>

      <div className="query-group">
        <h4>Find Customers with No Policies</h4>
        <div className="query-inputs">
          <button onClick={() => executeQuery('customersWithNoPolicies')}>Execute</button>
        </div>
      </div>
    </div>
  );

  const renderResults = () => {
    if (results.length === 0) return null;

    return (
      <div className="results-section">
        <h3>Query Results ({results.length} records)</h3>
        <div className="results-table">
          <table>
            <thead>
              <tr>
                {Object.keys(results[0] || {}).map(key => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={index}>
                  {Object.values(result).map((value, valueIndex) => (
                    <td key={valueIndex}>{String(value)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  if (loading && results.length === 0) {
    return <div className="loading">Loading query interface...</div>;
  }

  return (
    <div className="query-interface">
      <div className="query-header">
        <h2>Insurance Analytics Dashboard</h2>
        <button onClick={() => onNavigate('home')} className="back-button">
          ← Back to Home
        </button>
      </div>

      <div className="tab-navigation">
        <button
          className={`tab-button ${activeTab === 'policy' ? 'active' : ''}`}
          onClick={() => setActiveTab('policy')}
        >
          Policy Queries
        </button>
        <button
          className={`tab-button ${activeTab === 'customer' ? 'active' : ''}`}
          onClick={() => setActiveTab('customer')}
        >
          Customer Queries
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      <div className="query-content">
        {activeTab === 'policy' ? renderPolicyQueries() : renderCustomerQueries()}
      </div>

      {loading && <div className="loading">Executing query...</div>}
      
      {renderResults()}
      
      {/* Toast Notification for No Query Results */}
      <ToastNotification
        message="No results found for your search. Please try again."
        type="warning"
        show={showNoResultsToast}
        onClose={() => setShowNoResultsToast(false)}
        duration={5000}
      />
    </div>
  );
};

export default QueryInterface; 