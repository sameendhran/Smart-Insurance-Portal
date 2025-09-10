package com.sam.InsuranceManagement.Config;

import com.sam.InsuranceManagement.DAO.UserRepository;
import com.sam.InsuranceManagement.Entity.User;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.List;

@Configuration
public class UserDetailsServiceConfig {

    // This bean provides the UserDetailsService implementation
    @Bean
    public UserDetailsService userDetailsService(UserRepository userRepository) {
        return username -> {
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

            String roleWithPrefix = "ROLE_" + user.getRole().toUpperCase();
            System.out.println("DEBUG: UserDetailsService loading user: " + user.getUsername() +
                    ", Role from DB: " + user.getRole() +
                    ", Enabled in DB: " + user.isEnabled() + // Added for clearer debugging
                    ", Building Spring Security Authority: " + roleWithPrefix);

            // IMPORTANT CHANGE: Use the constructor that explicitly takes 'enabled' status
            return new org.springframework.security.core.userdetails.User(
                    user.getUsername(),
                    user.getPassword(),
                    user.isEnabled(), // Pass the enabled status from your User entity
                    true, // accountNonExpired (set to true unless you have expiration logic)
                    true, // credentialsNonExpired (set to true unless you have expiration logic)
                    true, // accountNonLocked (set to true unless you have locking logic)
                    List.of(new SimpleGrantedAuthority(roleWithPrefix))
            );
        };
    }
}