
package com.sam.InsuranceManagement.DTO;

import lombok.Data; // Assuming you use Lombok

@Data // Generates getters, setters, toString, etc.
public class LoginRequestDTO {
    private String username;
    private String password;
}