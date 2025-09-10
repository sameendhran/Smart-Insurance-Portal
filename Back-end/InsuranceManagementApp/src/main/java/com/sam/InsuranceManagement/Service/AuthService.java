package com.sam.InsuranceManagement.Service;

import com.sam.InsuranceManagement.DAO.UserRepository;
import com.sam.InsuranceManagement.DTO.LoginRequestDTO;
import com.sam.InsuranceManagement.DTO.RegisterRequestDTO;
import com.sam.InsuranceManagement.Entity.User;
import com.sam.InsuranceManagement.Response.ResponseObject; // Correct import for your ResponseObject
import com.sam.InsuranceManagement.util.JwtUtil; // Assuming JwtUtil is correctly implemented
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil; // For generating JWT tokens

    @Autowired
    private AuthenticationManager authenticationManager; // For Spring Security authentication

    /**
     * Handles user registration.
     * Encodes the password, sets the user as enabled by default,
     * and assigns a default "USER" role.
     *
     * @param request The RegisterRequestDTO containing username and password.
     * @return A ResponseObject indicating the success or failure of the registration.
     */
    public ResponseObject registerUser(RegisterRequestDTO request) {
        // Check if username already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            return new ResponseObject("User '" + request.getUsername() + "' already exists. Please choose a different username.", false);
        }

        User newUser = new User();
        newUser.setUsername(request.getUsername());
        newUser.setPassword(passwordEncoder.encode(request.getPassword())); // Encode password before saving

        // **************** CRITICAL CHANGE HERE ****************
        newUser.setEnabled(true); // <--- CHANGE THIS TO TRUE to automatically enable new users
        // ******************************************************

        newUser.setRole("USER"); // Assign default role

        try {
            userRepository.save(newUser);
            // Changed success message to reflect immediate enablement
            return new ResponseObject("User registered successfully! You can now log in.", true);
        } catch (Exception e) {
            // Log the exception for debugging purposes
            System.err.println("Error during user registration: " + e.getMessage());
            return new ResponseObject("Failed to register user. Please try again.", false);
        }
    }

    /**
     * Handles user login and generates a JWT token upon successful authentication.
     * Also checks if the user account is enabled.
     *
     * @param request The LoginRequestDTO containing username and password.
     * @return A ResponseObject containing the JWT token (as data) on success,
     * or a failure message.
     */
    public ResponseObject loginUser(LoginRequestDTO request) {
        try {
            // Authenticate the user credentials using Spring Security's AuthenticationManager
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            // If authentication is successful, retrieve UserDetails and generate JWT
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();

            // Retrieve the full User entity to check the 'enabled' status
            // This check is now less critical for *newly registered* users
            // if registerUser sets enabled=true, but important for other cases
            User user = userRepository.findByUsername(request.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found after successful authentication."));

            // This check remains here to handle cases where users might be manually disabled later,
            // or if older disabled users try to log in.
            if (!user.isEnabled()) {
                // This message will still be returned if an *already existing disabled user* tries to log in.
                return new ResponseObject("Account is pending approval. Please contact support.", false);
            }

            // Generate JWT token for the authenticated and enabled user
            final String jwt = jwtUtil.generateToken(userDetails);

            // Return the JWT token in the 'data' field of the ResponseObject
            return new ResponseObject(jwt, "Login successful.", true);
        } catch (Exception e) {
            // Catch specific authentication exceptions (e.g., BadCredentialsException)
            // for more specific error messages if desired.
            System.err.println("Authentication failed for user '" + request.getUsername() + "': " + e.getMessage());
            return new ResponseObject("Invalid username or password.", false);
        }
    }
}