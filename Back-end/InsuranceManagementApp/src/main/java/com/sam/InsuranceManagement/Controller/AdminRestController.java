package com.sam.InsuranceManagement.Controller;

import com.sam.InsuranceManagement.DTO.AdminUserDTO; // Still needed if you explicitly return AdminUserDTOs in 'data' field
import com.sam.InsuranceManagement.Response.ResponseObject;
import com.sam.InsuranceManagement.Service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminRestController {

    @Autowired
    private AdminService adminService;

    /**
     * Retrieves a list of users whose accounts are pending approval.
     * Accessible by administrators.
     *
     * @return A ResponseEntity containing a ResponseObject. The 'data' field of the ResponseObject
     * will contain a List<AdminUserDTO> if successful, or a failure message.
     */
    @GetMapping("/users/pending")
    public ResponseEntity<ResponseObject> findPendingUsers() { // Changed generic type to just ResponseObject
        ResponseObject response = adminService.getPendingUsers();
        return ResponseEntity.ok(response);
    }

    /**
     * Enables a specific user's account, allowing them to log in.
     * Accessible by administrators.
     *
     * @param userId The ID of the user to enable.
     * @return A ResponseEntity containing a ResponseObject with a success or failure message.
     */
    @PostMapping("/users/enable/{userId}")
    public ResponseEntity<ResponseObject> enableUser(@PathVariable Long userId) { // Changed generic type to just ResponseObject
        ResponseObject response = adminService.enableUser(userId);
        return ResponseEntity.ok(response);
    }
}
