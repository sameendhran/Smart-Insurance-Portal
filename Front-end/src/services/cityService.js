// src/services/cityService.js

import apiClient from './authService';
import { extractData, getErrorMessage } from './apiUtils';

const CITY_API_URL = '/cities'; // This path is now relative to apiClient's baseURL ('/api')

const cityService = {
  getAllCities: async () => {
    try {
      const response = await apiClient.get(CITY_API_URL);
      const result = extractData(response);
      
      if (result && result.cityListDTO) {
        return result.cityListDTO;
      } else {
        console.warn("getAllCities: Backend response did not contain cityListDTO. Returning empty array.");
        return [];
      }
    } catch (error) {
      console.error("Error fetching cities:", error.response ? error.response.data : error.message);
      throw new Error(getErrorMessage(error));
    }
  },

  getCityById: async (id) => {
    try {
      const response = await apiClient.get(`${CITY_API_URL}/${id}`);
      const result = extractData(response);
      
      if (result && result.cityDTO) {
        return result.cityDTO;
      } else {
        throw new Error("City not found or unexpected response format.");
      }
    } catch (error) {
      console.error(`Error fetching city with ID ${id}:`, error.response ? error.response.data : error.message);
      throw new Error(getErrorMessage(error));
    }
  },

  createCity: async (cityData) => {
    try {
      const response = await apiClient.post(CITY_API_URL, cityData);
      const result = extractData(response);
      
      if (result && result.cityDTO) {
        return result.cityDTO;
      } else {
        throw new Error("Unexpected response format after city creation.");
      }
    } catch (error) {
      console.error("Error creating city:", error.response ? error.response.data : error.message);
      throw new Error(getErrorMessage(error));
    }
  },

  updateCity: async (id, cityData) => {
    try {
      const response = await apiClient.put(`${CITY_API_URL}/${id}`, cityData);
      const result = extractData(response);
      
      if (result && result.cityDTO) {
        return result.cityDTO;
      } else {
        throw new Error("Unexpected response format after city update.");
      }
    } catch (error) {
      console.error(`Error updating city with ID ${id}:`, error.response ? error.response.data : error.message);
      throw new Error(getErrorMessage(error));
    }
  },

  deleteCity: async (id) => {
    try {
      const response = await apiClient.delete(`${CITY_API_URL}/${id}`);
      const result = extractData(response);
      return result;
    } catch (error) {
      console.error(`Error deleting city with ID ${id}:`, error.response ? error.response.data : error.message);
      throw new Error(getErrorMessage(error));
    }
  },
};

// Named exports
export const getAllCities = cityService.getAllCities;
export const getCityById = cityService.getCityById;
export const createCity = cityService.createCity;
export const updateCity = cityService.updateCity;
export const deleteCity = cityService.deleteCity;

// Default export
export default cityService; 