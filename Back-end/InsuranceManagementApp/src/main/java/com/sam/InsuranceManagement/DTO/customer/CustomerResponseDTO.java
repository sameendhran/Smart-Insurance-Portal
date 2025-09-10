package com.sam.InsuranceManagement.DTO.customer;

import lombok.Data;

@Data
public class CustomerResponseDTO {
    private int customerId;
    private String firstName;
    private String lastName;
    private char gender;
    private String dob;
    private String mobileNumber;
    private String cityName;
    private int stateId;
    private int countryId;
    private int occupationId;
    private String createdDate;
    private String updatedDate;
}
