package com.sam.InsuranceManagement;

import com.sam.InsuranceManagement.DAO.UserRepository;
import com.sam.InsuranceManagement.Entity.User;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing; // <--- ADD THIS IMPORT
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
@EnableJpaAuditing // <--- ADD THIS ANNOTATION
public class InsuranceManagementApplication {

	public static void main(String[] args) {
		SpringApplication.run(InsuranceManagementApplication.class, args);
	}


@Bean
public CommandLineRunner demoData(UserRepository UserRepository, PasswordEncoder passwordEncoder) {
	return args -> {
		// Create a default admin user if not exists
		if (UserRepository.findByUsername("admin").isEmpty()) {
			User adminUser = new User();
			adminUser.setUsername("admin");
			adminUser.setPassword(passwordEncoder.encode("adminpassword"));
			adminUser.setEnabled(true);
			adminUser.setRole("ADMIN"); // NEW: Assign ADMIN role
			UserRepository.save(adminUser);
			System.out.println("Default admin user 'admin' created with password 'adminpassword' and role ADMIN");
		}

		// Create a default test user
		if (UserRepository.findByUsername("testuser").isEmpty()) {
			User testUser = new User();
			testUser.setUsername("testuser");
			testUser.setPassword(passwordEncoder.encode("testpassword"));
			testUser.setEnabled(true);
			testUser.setRole("USER"); // NEW: Assign USER role
			UserRepository.save(testUser);
			System.out.println("Default test user 'testuser' created with password 'testpassword' and role USER");
		}

		// For any newly registered users, their role will typically be set to "USER" by default
		// in your registration service.
	};
}
}
