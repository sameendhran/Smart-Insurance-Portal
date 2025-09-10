package com.sam.InsuranceManagement.DTO.coverage;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CoverageResponseDTO {
    private int coverageId;

    public CoverageResponseDTO() {
    }

    private String coverageName;
}
