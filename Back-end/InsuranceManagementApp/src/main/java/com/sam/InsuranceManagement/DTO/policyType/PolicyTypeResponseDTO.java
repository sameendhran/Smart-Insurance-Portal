package com.sam.InsuranceManagement.DTO.policyType;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
public class PolicyTypeResponseDTO {
    private int typeId;
    private String typeName;
}
