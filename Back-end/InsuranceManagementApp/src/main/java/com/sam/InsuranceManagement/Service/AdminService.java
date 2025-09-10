package com.sam.InsuranceManagement.Service;

import com.sam.InsuranceManagement.DAO.UserRepository;
import com.sam.InsuranceManagement.DTO.AdminUserDTO;
import com.sam.InsuranceManagement.Entity.User;
import com.sam.InsuranceManagement.Response.ResponseObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    // The DateTimeFormatter is not currently used in the provided methods,
    // but kept for potential future use if createdAt needs formatting.
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    /**
     * Retrieves a list of users who are currently pending approval (enabled = false).
     * Maps these User entities to AdminUserDTOs and returns them in a ResponseObject.
     *
     * @return A ResponseObject containing a list of AdminUserDTOs if pending users exist,
     * or a failure message if no users are pending.
     */
    public ResponseObject getPendingUsers() { // Changed return type to non-generic ResponseObject
        List<User> pendingUsers = userRepository.findByEnabledFalse();

        if (pendingUsers.isEmpty()) {
            // Use the new constructor for messages without data
            return new ResponseObject("No users pending approval.", false);
        }

        List<AdminUserDTO> adminUserListDTO = pendingUsers.stream()
                .map(this::mapUserToAdminUserDTO)
                .collect(Collectors.toList());

        // Use the new constructor for data with a success message
        return new ResponseObject(adminUserListDTO, "Pending users fetched successfully.", true);
    }

    /**
     * Enables a specific user's account by setting their 'enabled' status to true.
     *
     * @param userId The ID of the user to enable.
     * @return A ResponseObject indicating the success or failure of the operation.
     */
    public ResponseObject enableUser(Long userId) { // Changed return type to non-generic ResponseObject
        Optional<User> userOptional = userRepository.findById(userId);

        if (userOptional.isEmpty()) {
            // User not found, return failure message
            return new ResponseObject("User not found.", false);
        }

        User user = userOptional.get();
        if (user.isEnabled()) {
            // User is already enabled, return failure message
            return new ResponseObject("User is already enabled.", false);
        }

        // Enable the user and save changes
        user.setEnabled(true);
        userRepository.save(user);

        // Return success message
        return new ResponseObject("User '" + user.getUsername() + "' enabled successfully.", true);
    }

    /**
     * Helper method to map a User entity to an AdminUserDTO.
     *
     * @param user The User entity to map.
     * @return The mapped AdminUserDTO.
     */
    private AdminUserDTO mapUserToAdminUserDTO(User user) {
        AdminUserDTO dto = new AdminUserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEnabled(user.isEnabled());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setRole(user.getRole());
        return dto;
    }
}
