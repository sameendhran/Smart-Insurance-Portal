package com.sam.InsuranceManagement.Controller;

import com.sam.InsuranceManagement.DTO.LoginRequestDTO;
import com.sam.InsuranceManagement.DTO.RegisterRequestDTO;
import com.sam.InsuranceManagement.Response.ResponseObject; // Correct import for your ResponseObject
import com.sam.InsuranceManagement.Service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthRestController {

    @Autowired
    private AuthService authService;

    /**
     * Handles user login requests.
     *
     * @param loginRequest The DTO containing username and password for login.
     * @return A ResponseEntity containing a ResponseObject with a success/failure message
     * and potentially a JWT token or other relevant data in the 'data' field.
     */
    @PostMapping("/login")
    public ResponseEntity<ResponseObject> login(@RequestBody LoginRequestDTO loginRequest) {
        // The ResponseObject is not a generic class (e.g., ResponseObject<T>),
        // so the return type should simply be ResponseObject.
        ResponseObject response = authService.loginUser(loginRequest);
        return ResponseEntity.ok(response);
    }

    /**
     * Handles user registration requests.
     *
     * @param registerRequest The DTO containing username and password for registration.
     * @return A ResponseEntity containing a ResponseObject with a success/failure message
     * indicating the result of the registration attempt.
     */
    @PostMapping("/register")
    public ResponseEntity<ResponseObject> register(@RequestBody RegisterRequestDTO registerRequest) {
        // Similar to login, the ResponseObject is not generic,
        // so the return type should simply be ResponseObject.
        ResponseObject response = authService.registerUser(registerRequest);
        return ResponseEntity.ok(response);
    }
}
