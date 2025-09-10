// src/main/java/com/banking/dto/RegisterRequestDTO.java
package com.sam.InsuranceManagement.DTO;

import lombok.Data;

@Data
public class RegisterRequestDTO {
    private String username;
    private String password;
    // You can add more fields here like email, firstName, lastName etc.
    // private String email;
}