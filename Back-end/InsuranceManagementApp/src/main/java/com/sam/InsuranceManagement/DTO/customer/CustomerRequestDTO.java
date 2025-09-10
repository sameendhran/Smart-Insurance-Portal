package com.sam.InsuranceManagement.DTO.customer;

import lombok.Data;

@Data
public class CustomerRequestDTO {
    private String firstName;
    private String lastName;
    private String gender;
    private String dob;
    private String mobileNumber;
    private int cityId;
    private int stateId;
    private int countryId;
    private int occupationId;
}
