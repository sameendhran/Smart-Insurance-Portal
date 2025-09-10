// src/services/apiUtils.js

/**
 * Extracts the main data payload from a successful Axios response that uses ResponseObject.
 * Assumes backend responses are structured like:
 * { success: boolean, message: string, data: T | null }
 * OR
 * { successMessage: string, failureMessage: string, customerListDTO: [...] }
 *
 * @param {object} response - The Axios response object.
 * @returns {object|array|string|null} The extracted 'data' field, or null if not found/error.
 */
export const extractData = (response) => {
    console.log("=== DEBUG: extractData function ===");
    console.log("Response:", response);
    console.log("Response.data:", response.data);
    
    if (!response || !response.data) {
        console.warn("extractData: Response or response.data is null/undefined.");
        throw new Error("No response data received from server");
    }

    // Check if the response matches the ResponseObject structure
    if (typeof response.data === 'object' && response.data !== null) {
        console.log("Response.data is object, checking fields...");
        console.log("Has 'success' field:", 'success' in response.data);
        console.log("Has 'successMessage' field:", 'successMessage' in response.data);
        console.log("Has 'failureMessage' field:", 'failureMessage' in response.data);
        console.log("Success field value:", response.data?.success);
        console.log("SuccessMessage field value:", response.data?.successMessage);
        console.log("FailureMessage field value:", response.data?.failureMessage);
        
        // If it's a ResponseObject with failureMessage (check this first)
        if ('failureMessage' in response.data && response.data.failureMessage) {
            console.warn("extractData: Backend ResponseObject indicates failure:", response.data.failureMessage);
            throw new Error(response.data.failureMessage);
        }
        
        // SPECIAL CASE: Backend returns data but sets success to false incorrectly
        // Check if we have actual data despite success being false
        if ('customerListDTO' in response.data && response.data.customerListDTO) {
            console.log("Found customerListDTO with data, treating as success despite success: false");
            return response.data;
        }
        
        if ('customerDTO' in response.data && response.data.customerDTO) {
            console.log("Found customerDTO with data, treating as success despite success: false");
            return response.data;
        }
        
        if ('cityListDTO' in response.data && response.data.cityListDTO) {
            console.log("Found cityListDTO with data, treating as success despite success: false");
            return response.data;
        }
        
        if ('policyListDTO' in response.data && response.data.policyListDTO) {
            console.log("Found policyListDTO with data, treating as success despite success: false");
            return response.data;
        }
        
        if ('policyDTO' in response.data && response.data.policyDTO) {
            console.log("Found policyDTO with data, treating as success despite success: false");
            return response.data;
        }
        
        if ('coverageDTO' in response.data && response.data.coverageDTO) {
            console.log("Found coverageDTO with data, treating as success despite success: false");
            return response.data;
        }
        
        if ('coverageListDTO' in response.data && response.data.coverageListDTO) {
            console.log("Found coverageListDTO with data, treating as success despite success: false");
            return response.data;
        }
        
        if ('policyTypeDTO' in response.data && response.data.policyTypeDTO) {
            console.log("Found policyTypeDTO with data, treating as success despite success: false");
            return response.data;
        }
        
        if ('policyTypeListDTO' in response.data && response.data.policyTypeListDTO) {
            console.log("Found policyTypeListDTO with data, treating as success despite success: false");
            return response.data;
        }
        
        if ('cityDTO' in response.data && response.data.cityDTO) {
            console.log("Found cityDTO with data, treating as success despite success: false");
            return response.data;
        }
        
        if ('policyBasicList' in response.data && response.data.policyBasicList) {
            console.log("Found policyBasicList with data, treating as success despite success: false");
            return response.data;
        }
        
        if ('premiumTotal' in response.data && response.data.premiumTotal !== undefined) {
            console.log("Found premiumTotal with data, treating as success despite success: false");
            return response.data;
        }
        
        if ('customerCount' in response.data && response.data.customerCount !== undefined) {
            console.log("Found customerCount with data, treating as success despite success: false");
            return response.data;
        }
        
        // If it's a ResponseObject with explicit success field (check this first now)
        if ('success' in response.data) {
            console.log("Found 'success' field, value:", response.data.success);
            if (response.data.success) {
                console.log("Success is true, returning entire response.data");
                return response.data;
            } else {
                // Check if we have any data fields despite success being false
                const hasData = response.data.customerListDTO || response.data.customerDTO || 
                               response.data.cityDTO || response.data.cityListDTO || 
                               response.data.policyDTO || response.data.policyListDTO ||
                               response.data.coverageDTO || response.data.coverageListDTO || 
                               response.data.policyTypeDTO || response.data.policyTypeListDTO ||
                               response.data.policyBasicList || response.data.premiumTotal !== undefined ||
                               response.data.customerCount !== undefined;
                
                if (hasData) {
                    console.log("Found data fields despite success: false, treating as success");
                    return response.data;
                }
                
                console.warn("extractData: Backend ResponseObject indicates failure. Data may not be present.");
                throw new Error(response.data.failureMessage || "Request failed");
            }
        }
        
        // If it's a ResponseObject with successMessage (backend doesn't set success field properly)
        if ('successMessage' in response.data && response.data.successMessage) {
            console.log("Found 'successMessage' field, value:", response.data.successMessage);
            console.log("This is a successful response, returning entire response.data");
            return response.data;
        }
    }

    console.log("Returning direct response.data");
    return response.data;
};

/**
 * Extracts an appropriate error message from an Axios error object,
 * specifically looking for messages within the backend's ResponseObject structure.
 *
 * @param {object} error - The Axios error object.
 * @returns {string} The extracted error message or a generic one.
 */
export const getErrorMessage = (error) => {
    console.log("getErrorMessage called with error:", error);
    
    if (error.response && error.response.data) {
        console.log("Error has response.data:", error.response.data);
        // Check if the error response itself is a ResponseObject
        if (typeof error.response.data === 'object' && error.response.data !== null) {
            // Check for failureMessage first (backend uses this)
            if (error.response.data.failureMessage) {
                return error.response.data.failureMessage;
            }
            // Check for message field
            if (error.response.data.message) {
                return error.response.data.message;
            }
        }
        // Fallback for other specific fields if ResponseObject is not strictly followed for errors
        if (error.response.data.failureMessage) {
            return error.response.data.failureMessage;
        }
        // If it's just a string error from backend
        if (typeof error.response.data === 'string') {
            return error.response.data;
        }
    } else if (error.request) {
        // The request was made but no response was received (e.g., network error)
        console.log("Network error detected");
        return 'Network error: Could not connect to the server. Please check your internet connection and ensure the backend is running on http://localhost:8080.';
    } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Request setup error:", error.message);
        return error.message || "An unexpected client-side error occurred.";
    }
    
    // Fallback error message
    return "An unknown error occurred. Please try again.";
};