package com.sam.InsuranceManagement.Service;

import com.sam.InsuranceManagement.BO.PolicyBO;
import com.sam.InsuranceManagement.DTO.policy.PolicyRequestDTO;
import com.sam.InsuranceManagement.DTO.policy.PolicyResponseDTO;
import com.sam.InsuranceManagement.Exception.PolicyException;
import com.sam.InsuranceManagement.Projection.PolicyBasicInfo;
import com.sam.InsuranceManagement.Response.ResponseObject;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PolicyService {

    private static final String ERROR_PREFIX = "Error: ";

    private final PolicyBO bo;

    // === Add Policy ===
    public ResponseObject addPolicy(PolicyRequestDTO dto) {
        ResponseObject response = new ResponseObject();
        try {
            PolicyResponseDTO policyDTO = bo.addPolicy(dto);
            response.setSuccessMessage("Policy added successfully");
            response.setPolicyDTO(policyDTO);           //  return the response DTO
        } catch (PolicyException e) {
            response.setFailureMessage(ERROR_PREFIX + e.getMessage());
            log.error("Error in addPolicy", e);
        }
        return response;
    }

    // === Get Policy by ID ===
    public ResponseObject getPolicyById(int id) {
        ResponseObject response = new ResponseObject();
        try {
            PolicyResponseDTO policyDTO = bo.getPolicyById(id);
            response.setPolicyDTO(policyDTO);           //  return a single DTO
        } catch (PolicyException e) {
            response.setFailureMessage(ERROR_PREFIX + e.getMessage());
            log.error("Error in getPolicyById", e);
        }
        return response;
    }

    // === Get All Policies ===
    public ResponseObject getAllPolicies() {
        ResponseObject response = new ResponseObject();
        try {
            List<PolicyResponseDTO> policies = bo.getAllPolicies();
            response.setPolicyListDTO(policies);        //  return list of DTOs
        } catch (PolicyException e) {
            response.setFailureMessage("Error fetching policies: " + e.getMessage());
            log.error("Error in getAllPolicies", e);
        }
        return response;
    }

    // === Get Policies by Customer ID ===
    public ResponseObject getPoliciesByCustomerId(int customerId) {
        ResponseObject response = new ResponseObject();
        try {
            List<PolicyResponseDTO> policies = bo.getPoliciesByCustomerId(customerId);
            response.setPolicyListDTO(policies);        //  return list of DTOs
        } catch (PolicyException e) {
            response.setFailureMessage("Error fetching policies for Customer ID: " + customerId + " - " + e.getMessage());
            log.error("Error in getPoliciesByCustomerId", e);
        }
        return response;
    }

    // ==== JPQL Queries ====

    public ResponseObject getPoliciesWithPremiumGreaterThan(double premium) {
        ResponseObject response = new ResponseObject();
        try {
            List<PolicyResponseDTO> list = bo.getPoliciesWithPremiumGreaterThan(premium);
            response.setPolicyListDTO(list);
            response.setSuccessMessage("Policies fetched successfully");
        } catch (PolicyException e) {
            response.setFailureMessage(ERROR_PREFIX + e.getMessage());
            log.error("Error in getPoliciesWithPremiumGreaterThan", e);
        }
        return response;
    }

    // Get policies by customer first name
    public ResponseObject getPoliciesByCustomerName(String name) {
        ResponseObject response = new ResponseObject();
        try {
            List<PolicyResponseDTO> list = bo.getPoliciesByCustomerName(name);
            response.setPolicyListDTO(list);
        } catch (PolicyException e) {
            response.setFailureMessage(ERROR_PREFIX + e.getMessage());
        }
        return response;
    }

    // Get policies by customer gender
    public ResponseObject getPoliciesByCustomerGender(char gender) {
        ResponseObject response = new ResponseObject();
        try {
            List<PolicyResponseDTO> list = bo.getPoliciesByCustomerGender(gender);
            response.setPolicyListDTO(list);
        } catch (PolicyException e) {
            response.setFailureMessage(ERROR_PREFIX + e.getMessage());
        }
        return response;
    }

    // Get policies by customer city
    public ResponseObject getPoliciesByCustomerCity(String cityName) {
        ResponseObject response = new ResponseObject();
        try {
            List<PolicyResponseDTO> list = bo.getPoliciesByCustomerCity(cityName);
            response.setPolicyListDTO(list);
        } catch (PolicyException e) {
            response.setFailureMessage(ERROR_PREFIX + e.getMessage());
        }
        return response;
    }

    // Get policies within date range
    public ResponseObject getPoliciesByCreatedDateRange(Date startDate, Date endDate) {
        ResponseObject response = new ResponseObject();
        try {
            List<PolicyResponseDTO> list = bo.getPoliciesByCreatedDateRange(startDate, endDate);
            response.setPolicyListDTO(list);
        } catch (PolicyException e) {
            response.setFailureMessage(ERROR_PREFIX + e.getMessage());
        }
        return response;
    }

    // ==== projection ====
    public ResponseObject getBasicPolicyInfo() {
        ResponseObject response = new ResponseObject();
        try {
            List<PolicyBasicInfo> list = bo.fetchBasicPolicyInfo(); // call BO
            response.setPolicyBasicList(list); // set into projection field
            response.setSuccessMessage("Basic policy info fetched");
        } catch (PolicyException e) {
            response.setFailureMessage("Error: " + e.getMessage());
            log.error("Error in getBasicPolicyInfo", e);
        }
        return response;
    }

    // ==== Aggregate function ====

    // Wraps the count in a response object with message
    public ResponseObject getPolicyCount() {
        ResponseObject response = new ResponseObject();
        response.setCustomerCount(bo.countPolicies()); // Reusing customerCount field
        response.setSuccessMessage("Total policy count fetched");
        return response;
    }

    // Wraps the total premium in a response object
    public ResponseObject getTotalPremium() {
        ResponseObject response = new ResponseObject();
        response.setPremiumTotal(bo.getTotalPremium()); // uses custom field
        response.setSuccessMessage("Total premium sum fetched");
        return response;
    }

    // Wraps grouped policy count data in response
    public ResponseObject getPolicyCountByCity() {
        ResponseObject response = new ResponseObject();
        response.setData(bo.getPolicyCountByCity()); // stores raw city,count
        response.setSuccessMessage("Grouped policy count by city fetched");
        return response;
    }


}
