// src/services/coverageService.js

// IMPORTANT: Import apiClient from authService.js for authenticated requests
import apiClient from './authService'; 
import { extractData, getErrorMessage } from './apiUtils';

// This path is now relative to apiClient's baseURL ('/api')
const COVERAGE_API_URL = '/coverages'; 

export const getAllCoverages = async () => {
    try {
        // Use the shared apiClient instance for requests that require authentication
        const response = await apiClient.get(COVERAGE_API_URL);
        const result = extractData(response); // Use extractData to get the actual data payload

        // Assuming your backend returns data like { "coverageListDTO": [...] } inside ResponseObject.data
        if (result && result.coverageListDTO) {
            return result.coverageListDTO;
        } else {
            console.warn("getAllCoverages: Backend response did not contain coverageListDTO. Returning empty array.");
            return [];
        }
    } catch (error) {
        console.error('Error fetching coverages:', error.response || error); // Log the full error
        // Re-throw a user-friendly error message wrapped in an Error object
        throw new Error(getErrorMessage(error)); 
    }
};