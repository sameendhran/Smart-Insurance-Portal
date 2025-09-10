package com.sam.InsuranceManagement.DTO.policy;

import lombok.Data;

@Data
public class PolicyRequestDTO {
    private String policyNumber;
    private double premium;
    private int coverageId;
    private int policyTypeId;
    private int customerId;
}
