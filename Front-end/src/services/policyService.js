// src/services/policyService.js

// IMPORTANT: Import apiClient from authService.js for authenticated requests
import apiClient from './authService'; 
import { getErrorMessage, extractData } from './apiUtils'; // Also use apiUtils for consistent error/data handling

// This path is now relative to apiClient's baseURL ('/api')
const POLICY_API_URL = '/policies'; 

// IMPORTANT: Remove the local 'api' axios.create instance.
// const api = axios.create({ ... }); // <-- DELETE THIS BLOCK

// Function to add a new policy
export const createPolicy = async (policyData) => {
    try {
        console.log("=== DEBUG: Creating Policy ===");
        console.log("Policy data being sent:", policyData);
        console.log("Policy data types:", {
            premium: typeof policyData.premium,
            coverageId: typeof policyData.coverageId,
            policyTypeId: typeof policyData.policyTypeId,
            customerId: typeof policyData.customerId
        });
        console.log("Policy data values:", {
            premium: policyData.premium,
            coverageId: policyData.coverageId,
            policyTypeId: policyData.policyTypeId,
            customerId: policyData.customerId
        });
        
        // Use the shared apiClient instance
        const response = await apiClient.post(POLICY_API_URL, policyData);
        console.log("Raw response:", response);
        console.log("Response data:", response.data);
        console.log("Response status:", response.status);
        console.log("Response headers:", response.headers);
        
        const result = extractData(response); // Use extractData for consistent data extraction
        console.log("Extracted result:", result);

        // Assuming policyDTO is nested under the 'data' field of your ResponseObject
        if (result && result.policyDTO) {
            console.log("Found policyDTO:", result.policyDTO);
            return result.policyDTO;
        } else {
            console.warn("No policyDTO found in result. Available keys:", result ? Object.keys(result) : 'null');
            // If extractData returned null/empty, or policyDTO wasn't there but success was true
            throw new Error(response.data?.message || "Unexpected response format after policy creation.");
        }
    } catch (error) {
        console.error("Error creating policy:", error);
        console.error("Error response:", error.response);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
        throw new Error(getErrorMessage(error)); // Throw an Error object with the message
    }
};

// Function to get all policies
export const getAllPolicies = async () => {
    try {
        // Use the shared apiClient instance
        const response = await apiClient.get(POLICY_API_URL);
        const result = extractData(response); // Use extractData

        // Assuming policyListDTO is nested under the 'data' field of your ResponseObject
        if (result && result.policyListDTO) {
            return result.policyListDTO;
        } else {
            // If no policies but also no failure message, return empty array or throw appropriate error
            console.warn("getAllPolicies: No policyListDTO found. Returning empty array.");
            return [];
        }
    } catch (error) {
        console.error("Error fetching policies:", error.response || error);
        throw new Error(getErrorMessage(error));
    }
};

// Function to get a policy by ID
export const getPolicyById = async (id) => {
    try {
        // Use the shared apiClient instance
        const response = await apiClient.get(`${POLICY_API_URL}/${id}`);
        const result = extractData(response); // Use extractData

        // Assuming policyDTO is nested under the 'data' field of your ResponseObject
        if (result && result.policyDTO) {
            return result.policyDTO;
        } else {
            throw new Error(response.data?.message || "Policy not found or unexpected response format.");
        }
    } catch (error) {
        console.error(`Error fetching policy with ID ${id}:`, error.response || error);
        throw new Error(getErrorMessage(error));
    }
};

// Function to update a policy
export const updatePolicy = async (id, policyData) => {
    try {
        const response = await apiClient.put(`${POLICY_API_URL}/${id}`, policyData);
        const result = extractData(response);

        if (result && result.policyDTO) {
            return result.policyDTO;
        } else {
            throw new Error("Unexpected response format after policy update.");
        }
    } catch (error) {
        console.error(`Error updating policy with ID ${id}:`, error.response || error);
        throw new Error(getErrorMessage(error));
    }
};

// Function to delete a policy
export const deletePolicy = async (id) => {
    try {
        const response = await apiClient.delete(`${POLICY_API_URL}/${id}`);
        const result = extractData(response);
        return result;
    } catch (error) {
        console.error(`Error deleting policy with ID ${id}:`, error.response || error);
        throw new Error(getErrorMessage(error));
    }
};

// You would similarly update any other policy-related service calls
// (e.g., updatePolicy, deletePolicy) to use `apiClient` and `extractData`/`getErrorMessage`.

// NEW: Find policies by customer gender
export const getPoliciesByGender = async (gender) => {
    try {
        const response = await apiClient.get(`${POLICY_API_URL}/by-gender`, {
            params: { gender }
        });
        const result = extractData(response);
        if (result && result.policyListDTO) {
            return result.policyListDTO;
        }
        return [];
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
};

// NEW: Find policies by date range (expects ISO yyyy-MM-dd)
export const getPoliciesByDateRange = async (startDate, endDate) => {
    try {
        const response = await apiClient.get(`${POLICY_API_URL}/by-date-range`, {
            params: { startDate, endDate }
        });
        const result = extractData(response);
        if (result && result.policyListDTO) {
            return result.policyListDTO;
        }
        return [];
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
};