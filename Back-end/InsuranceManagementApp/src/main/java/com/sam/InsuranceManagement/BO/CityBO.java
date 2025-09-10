package com.sam.InsuranceManagement.BO;

import com.sam.InsuranceManagement.DAO.CityRepository;
import com.sam.InsuranceManagement.DTO.city.CityRequestDTO;
import com.sam.InsuranceManagement.DTO.city.CityResponseDTO;
import com.sam.InsuranceManagement.Entity.City;
import com.sam.InsuranceManagement.Exception.CityException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class CityBO {

    private final CityRepository cityRepository;

    public CityResponseDTO addCity(CityRequestDTO dto) throws CityException {
        City city = mapRequestToEntity(dto);
        validateCity(city); // Ensures city name is valid (not blank, not too long, etc.)

        // Duplicate name check - avoids inserting city with same name (case-insensitive)
        List<City> existing = cityRepository.findByCityNameIgnoreCase(city.getCityName());
        if (!existing.isEmpty()) {
            throw new CityException("City with name '" + city.getCityName() + "' already exists.");
        }

        city = cityRepository.save(city);
        return mapEntityToResponse(city);
    }



    public CityResponseDTO updateCity(int id, CityRequestDTO dto) throws CityException {
        City existing = cityRepository.findById(id)
                .orElseThrow(() -> new CityException("City not found with ID: " + id));

        existing.setCityName(dto.getCityName());
        validateCity(existing); // Same validation logic as add

        // Prevent renaming to a name already used by another city (except itself)
        List<City> dup = cityRepository.findByCityNameIgnoreCase(existing.getCityName());
        if (!dup.isEmpty() && dup.get(0).getCityId() != id) {
            throw new CityException("Another city with the same name already exists.");
        }

        existing = cityRepository.save(existing);
        return mapEntityToResponse(existing);
    }



    public List<CityResponseDTO> getAllCities() throws CityException {
        List<City> cities = cityRepository.findAll();
        if (cities.isEmpty()) {
            throw new CityException("No cities found.");
        }
        return cities.stream().map(this::mapEntityToResponse).collect(Collectors.toList());
    }

    public CityResponseDTO getCityById(int id) throws CityException {
        City city = cityRepository.findById(id)
                .orElseThrow(() -> new CityException("City not found with ID: " + id));
        return mapEntityToResponse(city);
    }


    private void validateCity(City city) throws CityException {
        if (isBlank(city.getCityName())) {
            throw new CityException("City name is required."); // Blank name not allowed
        }

        if (city.getCityName().length() > 100) {
            throw new CityException("City name cannot exceed 100 characters."); // Avoid DB or UI issues
        }

        if (!city.getCityName().matches("[a-zA-Z ]+")) {
            throw new CityException("City name can only contain letters and spaces."); // Prevents symbols/numbers
        }
    }


    private boolean isBlank(String str) {
        if (str == null) return true;
        for (int i = 0; i < str.length(); i++) {
            if (!Character.isWhitespace(str.charAt(i))) {
                return false;
            }
        }
        return true;
    }

    private City mapRequestToEntity(CityRequestDTO dto) {
        City city = new City();
        city.setCityName(dto.getCityName());
        return city;
    }

    private CityResponseDTO mapEntityToResponse(City city) {
        CityResponseDTO dto = new CityResponseDTO();
        dto.setCityId(city.getCityId());
        dto.setCityName(city.getCityName());
        return dto;
    }
}
