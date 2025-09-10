package com.sam.InsuranceManagement.Controller;

import com.sam.InsuranceManagement.DTO.customer.CustomerRequestDTO;
import com.sam.InsuranceManagement.Response.ResponseObject;
import com.sam.InsuranceManagement.Service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService service;

    @PostMapping
    public ResponseEntity<ResponseObject> addCustomer(@RequestBody CustomerRequestDTO dto) {
        return ResponseEntity.ok(service.addCustomer(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseObject> updateCustomer(@PathVariable int id, @RequestBody CustomerRequestDTO dto) {
        return ResponseEntity.ok(service.updateCustomer(id, dto));
    }

    @GetMapping
    public ResponseEntity<ResponseObject> getAllCustomers() {
        return ResponseEntity.ok(service.getAllCustomers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseObject> getCustomerById(@PathVariable int id) {
        return ResponseEntity.ok(service.getCustomerById(id));
    }

    // ===== JPQL query =======      ===== JPQL quey ======

    @GetMapping("/by-city/{cityName}")
    public ResponseEntity<ResponseObject> getCustomersByCityName(@PathVariable String cityName) {
        return ResponseEntity.ok(service.getCustomersByCityName(cityName));
    }

    @GetMapping("/by-gender/{gender}")
    public ResponseEntity<ResponseObject> getCustomersByGender(@PathVariable char gender) {
        return ResponseEntity.ok(service.getCustomersByGender(gender));
    }

    @GetMapping("/born-before/{date}")
    public ResponseEntity<ResponseObject> getCustomersBornBefore(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(service.getCustomersBornBefore(date));
    }

    @GetMapping("/count-by-city/{cityName}")
    public ResponseEntity<ResponseObject> getCustomerCountByCity(@PathVariable String cityName) {
        return ResponseEntity.ok(service.getCustomerCountByCity(cityName));
    }

    @GetMapping("/premium-above/{amount}")
    public ResponseEntity<ResponseObject> getCustomersWithPremiumAbove(@PathVariable double amount) {
        return ResponseEntity.ok(service.getCustomersWithPremiumAbove(amount));
    }

    @GetMapping("/by-policy-type/{typeName}")
    public ResponseEntity<ResponseObject> getCustomersByPolicyType(@PathVariable String typeName) {
        return ResponseEntity.ok(service.getCustomersByPolicyType(typeName));
    }

    @GetMapping("/by-occupation/{occupationId}")
    public ResponseEntity<ResponseObject> getCustomersByOccupationId(@PathVariable int occupationId) {
        return ResponseEntity.ok(service.getCustomersByOccupationId(occupationId));
    }

    @GetMapping("/born-after/{date}")
    public ResponseEntity<ResponseObject> getCustomersBornAfter(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(service.getCustomersBornAfter(date));
    }

    @GetMapping("/no-policies")
    public ResponseEntity<ResponseObject> getCustomersWithNoPolicies() {
        return ResponseEntity.ok(service.getCustomersWithNoPolicies());
    }



}
