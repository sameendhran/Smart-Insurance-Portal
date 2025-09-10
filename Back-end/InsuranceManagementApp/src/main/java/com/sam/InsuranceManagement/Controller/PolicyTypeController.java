package com.sam.InsuranceManagement.Controller;

import com.sam.InsuranceManagement.DTO.policyType.PolicyTypeRequestDTO;
import com.sam.InsuranceManagement.Response.ResponseObject;
import com.sam.InsuranceManagement.Service.PolicyTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/policy-types")
@RequiredArgsConstructor
public class PolicyTypeController {

    private final PolicyTypeService service;

    @PostMapping
    public ResponseEntity<ResponseObject> add(@RequestBody PolicyTypeRequestDTO dto) {
        return ResponseEntity.ok(service.add(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseObject> update(@PathVariable int id, @RequestBody PolicyTypeRequestDTO dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @GetMapping
    public ResponseEntity<ResponseObject> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseObject> getById(@PathVariable int id) {
        return ResponseEntity.ok(service.getById(id));
    }

    // ==== J{QL Query ===
    // API to get policy types by type name (case-insensitive)
    @GetMapping("/by-type-name")
    public ResponseEntity<ResponseObject> getPolicyTypesByName(@RequestParam("name") String name) {
        return ResponseEntity.ok(service.getByTypeName(name)); // call service
    }

}
