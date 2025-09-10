// src/main/java/com/banking/dto/AdminUserDTO.java
package com.sam.InsuranceManagement.DTO;

import java.time.LocalDateTime;

public class AdminUserDTO {
    private Long id; // CHANGED from Integer to Long
    private String username;
    private boolean enabled;
    private LocalDateTime createdAt;
    private String role; // Assuming you also want to expose the role

    // Constructors
    public AdminUserDTO() {
    }

    public AdminUserDTO(Long id, String username, boolean enabled, LocalDateTime createdAt, String role) {
        this.id = id;
        this.username = username;
        this.enabled = enabled;
        this.createdAt = createdAt;
        this.role = role;
    }

    // Getters and Setters
    public Long getId() { // CHANGED return type to Long
        return id;
    }

    public void setId(Long id) { // CHANGED parameter type to Long
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}