package com.sam.InsuranceManagement.BO;

import com.sam.InsuranceManagement.DAO.PolicyTypeRepository;
import com.sam.InsuranceManagement.DTO.policyType.PolicyTypeRequestDTO;
import com.sam.InsuranceManagement.DTO.policyType.PolicyTypeResponseDTO;
import com.sam.InsuranceManagement.Entity.PolicyType;
import com.sam.InsuranceManagement.Exception.PolicyTypeException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class PolicyTypeBO {

    private final PolicyTypeRepository repo;

    public PolicyTypeResponseDTO addPolicyType(PolicyTypeRequestDTO dto) throws PolicyTypeException {
        PolicyType type = mapRequestToEntity(dto);
        validate(type);
        return mapEntityToResponse(repo.save(type));
    }

    public PolicyTypeResponseDTO updatePolicyType(int id, PolicyTypeRequestDTO dto) throws PolicyTypeException {
        PolicyType existing = repo.findById(id)
                .orElseThrow(() -> new PolicyTypeException("Policy Type not found with ID: " + id));
        existing.setTypeName(dto.getTypeName());
        validate(existing);
        return mapEntityToResponse(repo.save(existing));
    }

    public List<PolicyTypeResponseDTO> getAllPolicyTypes() throws PolicyTypeException {
        List<PolicyType> list = repo.findAll();
        if (list.isEmpty()) {
            throw new PolicyTypeException("No policy types found.");
        }
        return list.stream().map(this::mapEntityToResponse).collect(Collectors.toList());
    }

    public PolicyTypeResponseDTO getPolicyTypeById(int id) throws PolicyTypeException {
        PolicyType type = repo.findById(id)
                .orElseThrow(() -> new PolicyTypeException("Policy Type not found with ID: " + id));
        return mapEntityToResponse(type);
    }

    // ==== JPQL Query ====
    public List<PolicyTypeResponseDTO> getByTypeName(String name) throws PolicyTypeException {
        List<PolicyType> types = repo.findByTypeNameIgnoreCase(name);
        if (types.isEmpty()) {
            throw new PolicyTypeException("No policy types found with name: " + name);
        }
        return types.stream().map(this::mapEntityToResponse).collect(Collectors.toList());
    }

    private void validate(PolicyType type) throws PolicyTypeException {
        if (isBlank(type.getTypeName())) {
            throw new PolicyTypeException("Type name is required.");
        }
    }

    private PolicyType mapRequestToEntity(PolicyTypeRequestDTO dto) {
        PolicyType type = new PolicyType();
        type.setTypeName(dto.getTypeName());
        return type;
    }

    private PolicyTypeResponseDTO mapEntityToResponse(PolicyType type) {
        PolicyTypeResponseDTO dto = new PolicyTypeResponseDTO();
        dto.setTypeId(type.getTypeId());
        dto.setTypeName(type.getTypeName());
        return dto;
    }

    // Efficient blank checker (better than trim().isEmpty())
    private static boolean isBlank(String str) {
        if (str == null) return true;
        for (int i = 0; i < str.length(); i++) {
            if (!Character.isWhitespace(str.charAt(i))) {
                return false;
            }
        }
        return true;
    }
}
