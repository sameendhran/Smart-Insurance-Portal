package com.sam.InsuranceManagement.Controller;

import com.sam.InsuranceManagement.DTO.policy.PolicyRequestDTO;
import com.sam.InsuranceManagement.Response.ResponseObject;
import com.sam.InsuranceManagement.Service.PolicyService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;

@RestController
@RequestMapping("/api/policies")
@RequiredArgsConstructor
public class PolicyController {

    private final PolicyService service;

    @PostMapping
    public ResponseEntity<ResponseObject> addPolicy(@RequestBody PolicyRequestDTO dto) {
        return ResponseEntity.ok(service.addPolicy(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseObject> getPolicyById(@PathVariable int id) {
        return ResponseEntity.ok(service.getPolicyById(id));
    }

    @GetMapping
    public ResponseEntity<ResponseObject> getAllPolicies() {
        return ResponseEntity.ok(service.getAllPolicies());
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<ResponseObject> getPoliciesByCustomer(@PathVariable int customerId) {
        return ResponseEntity.ok(service.getPoliciesByCustomerId(customerId));
    }

    // ==== JPQL Queries ====

    @GetMapping("/by-premium/{amount}")
    public ResponseEntity<ResponseObject> getPoliciesByPremium(@PathVariable double amount) {
        return ResponseEntity.ok(service.getPoliciesWithPremiumGreaterThan(amount));
    }

    @GetMapping("/by-date")
    public ResponseEntity<ResponseObject> getPoliciesByDateRange(
            @RequestParam("start") @DateTimeFormat(pattern = "yyyy-MM-dd") Date start,
            @RequestParam("end") @DateTimeFormat(pattern = "yyyy-MM-dd") Date end
    ) {
        return ResponseEntity.ok(service.getPoliciesByCreatedDateRange(start, end));
    }

    @GetMapping("/by-customer-name")
    public ResponseEntity<ResponseObject> getPoliciesByCustomerName(@RequestParam("name") String name) {
        return ResponseEntity.ok(service.getPoliciesByCustomerName(name));
    }

    @GetMapping("/by-customer-gender")
    public ResponseEntity<ResponseObject> getPoliciesByCustomerGender(@RequestParam("gender") char gender) {
        return ResponseEntity.ok(service.getPoliciesByCustomerGender(gender));
    }

    @GetMapping("/by-customer-city")
    public ResponseEntity<ResponseObject> getPoliciesByCustomerCity(@RequestParam("city") String city) {
        return ResponseEntity.ok(service.getPoliciesByCustomerCity(city));
    }

    // Add mapping
    @GetMapping("/basic-info")
    public ResponseEntity<ResponseObject> getBasicInfo() {
        return ResponseEntity.ok(service.getBasicPolicyInfo());
    }

    // To return total policy count
    @GetMapping("/count")
    public ResponseEntity<ResponseObject> countPolicies() {
        return ResponseEntity.ok(service.getPolicyCount());
    }

    // REST endpoint to return sum of all premiums
    @GetMapping("/total-premium")
    public ResponseEntity<ResponseObject> getTotalPremium() {
        return ResponseEntity.ok(service.getTotalPremium());
    }

    // REST API to fetch grouped policy count by city
    @GetMapping("/group-by-city")
    public ResponseEntity<ResponseObject> getGroupedByCity() {
        return ResponseEntity.ok(service.getPolicyCountByCity());
    }


}
