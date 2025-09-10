package com.sam.InsuranceManagement.Service;

import com.sam.InsuranceManagement.BO.PolicyTypeBO;
import com.sam.InsuranceManagement.DTO.policyType.PolicyTypeRequestDTO;
import com.sam.InsuranceManagement.DTO.policyType.PolicyTypeResponseDTO;
import com.sam.InsuranceManagement.Exception.PolicyTypeException;
import com.sam.InsuranceManagement.Response.ResponseObject;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PolicyTypeService {

    private static final String ERROR_PREFIX = "Error: ";

    private final PolicyTypeBO bo;

    public ResponseObject add(PolicyTypeRequestDTO dto) {
        ResponseObject response = new ResponseObject();
        try {
            PolicyTypeResponseDTO saved = bo.addPolicyType(dto);
            response.setSuccessMessage("Policy Type added successfully");
            response.setPolicyTypeDTO(saved);   // <- NEW DTO
        } catch (PolicyTypeException e) {
            response.setFailureMessage(ERROR_PREFIX + e.getMessage());
            log.error("Add PolicyType failed", e);
        }
        return response;
    }

    public ResponseObject update(int id, PolicyTypeRequestDTO dto) {
        ResponseObject response = new ResponseObject();
        try {
            PolicyTypeResponseDTO updated = bo.updatePolicyType(id, dto);
            response.setSuccessMessage("Policy Type updated successfully");
            response.setPolicyTypeDTO(updated); // <- NEW DTO
        } catch (PolicyTypeException e) {
            response.setFailureMessage(ERROR_PREFIX + e.getMessage());
            log.error("Update PolicyType failed", e);
        }
        return response;
    }

    public ResponseObject getAll() {
        ResponseObject response = new ResponseObject();
        try {
            List<PolicyTypeResponseDTO> list = bo.getAllPolicyTypes();
            response.setPolicyTypeListDTO(list); // <- NEW LIST DTO
        } catch (PolicyTypeException e) {
            response.setFailureMessage(ERROR_PREFIX + e.getMessage());
            log.error("Get all PolicyTypes failed", e);
        }
        return response;
    }

    public ResponseObject getById(int id) {
        ResponseObject response = new ResponseObject();
        try {
            PolicyTypeResponseDTO pt = bo.getPolicyTypeById(id);
            response.setPolicyTypeDTO(pt);  // <- NEW DTO
        } catch (PolicyTypeException e) {
            response.setFailureMessage(ERROR_PREFIX + e.getMessage());
            log.error("Get PolicyType by ID failed", e);
        }
        return response;
    }

    // ==== JPQL Queries ====

    // Service method to fetch policy types by type name
    public ResponseObject getByTypeName(String name) {
        ResponseObject response = new ResponseObject();
        try {
            List<PolicyTypeResponseDTO> result = bo.getByTypeName(name); // fetch from BO
            response.setPolicyTypeListDTO(result); // set DTO list
        } catch (PolicyTypeException e) {
            response.setFailureMessage(e.getMessage());
            log.error("Get by type name failed", e);
        }
        return response;
    }

}
