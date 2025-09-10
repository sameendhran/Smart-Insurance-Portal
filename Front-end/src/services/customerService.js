  // src/main/frontend/src/services/customerService.js

  // IMPORTANT: Import the apiClient from authService.js
  // Adjust the path if your apiClient is in a different file (e.g., './api' or '../http-common')
  import apiClient from './authService'; 
  import { extractData, getErrorMessage } from './apiUtils';

  const CUSTOMER_API_URL = '/customers'; // This path is now relative to apiClient's baseURL ('/api')

  const customerService = {
    getAllCustomers: async () => {
      try {
        // Debug: Check if we have a token
        const token = localStorage.getItem('jwt_token');
        console.log("getAllCustomers - Token exists:", !!token);
        if (token) {
          console.log("getAllCustomers - Token preview:", token.substring(0, 20) + "...");
        }
        
        // Use apiClient.get instead of axios.get directly
        console.log("getAllCustomers - Making API call to:", apiClient.defaults.baseURL + CUSTOMER_API_URL);
        const response = await apiClient.get(CUSTOMER_API_URL); 
        console.log("getAllCustomers - Raw response:", response);
        
        const result = extractData(response); // Use extractData to get the actual data payload
        
        console.log("getAllCustomers - result:", result);
        
        // Check if result exists and has customerListDTO field
        if (result && result.customerListDTO) {
          console.log("getAllCustomers - customerListDTO found:", result.customerListDTO);
          return result.customerListDTO;
        } else if (result && Array.isArray(result)) {
          // Fallback: if result is directly an array
          console.log("getAllCustomers - result is direct array:", result);
          return result;
        } else {
          console.warn("getAllCustomers: Backend response did not contain customerListDTO. Full result:", result);
          return [];
        }
      } catch (error) {
        console.error("Error fetching customers:", error);
        console.error("Error response:", error.response);
        console.error("Error message:", error.message);
        console.error("Error request:", error.request);
        console.error("Error config:", error.config);
        
        // Provide more specific error messages
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error("Server responded with status:", error.response.status);
          console.error("Server response data:", error.response.data);
          throw new Error(getErrorMessage(error));
        } else if (error.request) {
          // The request was made but no response was received
          console.error("No response received from server");
          throw new Error("Network error: Could not connect to the server. Please ensure the backend is running on http://localhost:8080.");
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Request setup error:", error.message);
          throw new Error(`Request setup error: ${error.message}`);
        }
      }
    },

    // NEW: Find customers by policy type name
    getCustomersByPolicyType: async (typeName) => {
      try {
        const response = await apiClient.get(`${CUSTOMER_API_URL}/by-policy-type`, {
          params: { typeName }
        });
        const result = extractData(response);
        if (result && result.customerListDTO) {
          return result.customerListDTO;
        }
        return [];
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
    
    // Example for other methods:
    getCustomerById: async (id) => {
      try {
        const response = await apiClient.get(`${CUSTOMER_API_URL}/${id}`);
        const result = extractData(response);
        
        if (result && result.customerDTO) {
          return result.customerDTO;
        } else {
          throw new Error("Customer not found or unexpected response format.");
        }
      } catch (error) {
        console.error(`Error fetching customer with ID ${id}:`, error.response ? error.response.data : error.message);
        throw new Error(getErrorMessage(error));
      }
    },

    createCustomer: async (customerData) => {
      try {
        const response = await apiClient.post(CUSTOMER_API_URL, customerData);
        const result = extractData(response);
        
        if (result && result.customerDTO) {
          return result.customerDTO;
        } else {
          throw new Error("Unexpected response format after customer creation.");
        }
      } catch (error) {
        console.error("Error creating customer:", error.response ? error.response.data : error.message);
        throw new Error(getErrorMessage(error));
      }
    },

    updateCustomer: async (id, customerData) => {
      try {
        console.log('updateCustomer called with ID:', id, 'and data:', customerData);
        const response = await apiClient.put(`${CUSTOMER_API_URL}/${id}`, customerData);
        console.log('updateCustomer response:', response);
        const result = extractData(response);
        console.log('updateCustomer extracted result:', result);
        
        if (result && result.customerDTO) {
          return result.customerDTO;
        } else {
          throw new Error("Unexpected response format after customer update.");
        }
      } catch (error) {
        console.error(`Error updating customer with ID ${id}:`, error.response ? error.response.data : error.message);
        throw new Error(getErrorMessage(error));
      }
    },

    deleteCustomer: async (id) => {
      try {
        const response = await apiClient.delete(`${CUSTOMER_API_URL}/${id}`);
        const result = extractData(response);
        return result;
      } catch (error) {
        console.error(`Error deleting customer with ID ${id}:`, error.response ? error.response.data : error.message);
        throw new Error(getErrorMessage(error));
      }
    },
  };

  // Named exports
  export const getAllCustomers = customerService.getAllCustomers;
  export const getCustomerById = customerService.getCustomerById;
  export const createCustomer = customerService.createCustomer;
  export const updateCustomer = customerService.updateCustomer;
  export const deleteCustomer = customerService.deleteCustomer;

  // Default export
  export default customerService;