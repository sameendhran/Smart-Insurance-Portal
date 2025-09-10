package com.sam.InsuranceManagement.Controller;

import com.sam.InsuranceManagement.DTO.city.CityRequestDTO;
import com.sam.InsuranceManagement.Response.ResponseObject;
import com.sam.InsuranceManagement.Service.CityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cities")
@RequiredArgsConstructor
public class CityController {

    private final CityService service;

    @PostMapping
    public ResponseEntity<ResponseObject> addCity(@RequestBody CityRequestDTO dto) {
        return ResponseEntity.ok(service.addCity(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseObject> updateCity(@PathVariable int id, @RequestBody CityRequestDTO dto) {
        return ResponseEntity.ok(service.updateCity(id, dto));
    }

    @GetMapping
    public ResponseEntity<ResponseObject> getAllCities() {
        return ResponseEntity.ok(service.getAllCities());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseObject> getCityById(@PathVariable int id) {
        return ResponseEntity.ok(service.getCityById(id));
    }
}
