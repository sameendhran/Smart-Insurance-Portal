
package com.sam.InsuranceManagement.DAO;


import com.sam.InsuranceManagement.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    List<User> findByEnabledFalse(); // For pending users

    // NEW: Method to check if a user with a given username exists
    boolean existsByUsername(String username);
}