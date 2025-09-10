// src/services/policyTypeService.js
import apiClient from './authService';
import { extractData, getErrorMessage } from './apiUtils';

const POLICY_TYPE_API_URL = '/policy-types';

const policyTypeService = {
  getAllPolicyTypes: async () => {
    try {
      const response = await apiClient.get(POLICY_TYPE_API_URL);
      const result = extractData(response);
      
      if (result && result.policyTypeListDTO) {
        return result.policyTypeListDTO;
      } else {
        console.warn("getAllPolicyTypes: Backend response did not contain policyTypeListDTO. Returning empty array.");
        return [];
      }
    } catch (error) {
      console.error("Error fetching policy types:", error.response ? error.response.data : error.message);
      throw new Error(getErrorMessage(error));
    }
  },

  getPolicyTypeById: async (id) => {
    try {
      const response = await apiClient.get(`${POLICY_TYPE_API_URL}/${id}`);
      const result = extractData(response);
      
      if (result && result.policyTypeDTO) {
        return result.policyTypeDTO;
      } else {
        throw new Error("Policy type not found");
      }
    } catch (error) {
      console.error("Error fetching policy type:", error.response ? error.response.data : error.message);
      throw new Error(getErrorMessage(error));
    }
  },

  createPolicyType: async (policyTypeData) => {
    try {
      const response = await apiClient.post(POLICY_TYPE_API_URL, policyTypeData);
      const result = extractData(response);
      
      if (result && result.policyTypeDTO) {
        return result.policyTypeDTO;
      } else {
        throw new Error("Failed to create policy type");
      }
    } catch (error) {
      console.error("Error creating policy type:", error.response ? error.response.data : error.message);
      throw new Error(getErrorMessage(error));
    }
  },

  updatePolicyType: async (id, policyTypeData) => {
    try {
      const response = await apiClient.put(`${POLICY_TYPE_API_URL}/${id}`, policyTypeData);
      const result = extractData(response);
      
      if (result && result.policyTypeDTO) {
        return result.policyTypeDTO;
      } else {
        throw new Error("Failed to update policy type");
      }
    } catch (error) {
      console.error("Error updating policy type:", error.response ? error.response.data : error.message);
      throw new Error(getErrorMessage(error));
    }
  },

  deletePolicyType: async (id) => {
    try {
      const response = await apiClient.delete(`${POLICY_TYPE_API_URL}/${id}`);
      const result = extractData(response);
      
      if (result && result.successMessage) {
        return true;
      } else {
        throw new Error("Failed to delete policy type");
      }
    } catch (error) {
      console.error("Error deleting policy type:", error.response ? error.response.data : error.message);
      throw new Error(getErrorMessage(error));
    }
  }
};

export const getAllPolicyTypes = policyTypeService.getAllPolicyTypes;
export const getPolicyTypeById = policyTypeService.getPolicyTypeById;
export const createPolicyType = policyTypeService.createPolicyType;
export const updatePolicyType = policyTypeService.updatePolicyType;
export const deletePolicyType = policyTypeService.deletePolicyType;
export default policyTypeService;