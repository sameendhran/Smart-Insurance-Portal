package com.sam.InsuranceManagement.Controller;

import com.sam.InsuranceManagement.DTO.coverage.CoverageRequestDTO;
import com.sam.InsuranceManagement.Response.ResponseObject;
import com.sam.InsuranceManagement.Service.CoverageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/coverages")
@RequiredArgsConstructor
public class CoverageController {

    private final CoverageService service;

    @PostMapping
    public ResponseEntity<ResponseObject> addCoverage(@RequestBody CoverageRequestDTO dto) {
        return ResponseEntity.ok(service.addCoverage(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseObject> updateCoverage(
            @PathVariable int id, @RequestBody CoverageRequestDTO dto) {
        return ResponseEntity.ok(service.updateCoverage(id, dto));
    }

    @GetMapping
    public ResponseEntity<ResponseObject> getAllCoverages() {
        return ResponseEntity.ok(service.getAllCoverages());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseObject> getCoverageById(@PathVariable int id) {
        return ResponseEntity.ok(service.getCoverageById(id));
    }

    // ==== JPQL Queries ======

    @GetMapping("/by-name/{name}")
    public ResponseEntity<ResponseObject> getCoverageByNameIgnoreCase(@PathVariable String name) {
        return ResponseEntity.ok(service.getCoverageByNameIgnoreCase(name));
    }

}
