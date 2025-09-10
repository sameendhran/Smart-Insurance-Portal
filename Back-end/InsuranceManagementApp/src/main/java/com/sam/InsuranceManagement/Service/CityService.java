package com.sam.InsuranceManagement.Service;

import com.sam.InsuranceManagement.BO.CityBO;
import com.sam.InsuranceManagement.DTO.city.CityRequestDTO;
import com.sam.InsuranceManagement.DTO.city.CityResponseDTO;
import com.sam.InsuranceManagement.Exception.CityException;
import com.sam.InsuranceManagement.Response.ResponseObject;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class CityService {

    private final CityBO bo;

    public ResponseObject addCity(CityRequestDTO dto) {
        ResponseObject response = new ResponseObject();
        try {
            CityResponseDTO cityDTO = bo.addCity(dto); // returns DTO
            response.setSuccessMessage("City added successfully");
            response.setCityDTO(cityDTO);              // set DTO
        } catch (CityException e) {
            response.setFailureMessage("Error: " + e.getMessage());
            log.error("Error in addCity", e);
        }
        return response;
    }

    public ResponseObject updateCity(int id, CityRequestDTO dto) {
        ResponseObject response = new ResponseObject();
        try {
            if (id <= 0) {
                throw new CityException("Invalid city ID."); // Avoid invalid update calls
            }

            CityResponseDTO updatedCityDTO = bo.updateCity(id, dto);
            response.setSuccessMessage("City updated successfully");
            response.setCityDTO(updatedCityDTO);
        } catch (CityException e) {
            response.setFailureMessage("Error: " + e.getMessage());
            log.error("Error in updateCity", e);
        }
        return response;
    }


    public ResponseObject getCityById(int id) {
        ResponseObject response = new ResponseObject();
        try {
            if (id <= 0) {
                throw new CityException("Invalid city ID."); // Prevent unnecessary DB call
            }

            CityResponseDTO cityDTO = bo.getCityById(id);
            response.setCityDTO(cityDTO);
        } catch (CityException e) {
            response.setFailureMessage("Error: " + e.getMessage());
            log.error("Error in getCityById", e);
        }
        return response;
    }


    public ResponseObject getAllCities() {
        ResponseObject response = new ResponseObject();
        try {
            List<CityResponseDTO> cityDTOs = bo.getAllCities(); // returns List<DTO>
            response.setCityListDTO(cityDTOs);                  // set DTO list
        } catch (CityException e) {
            response.setFailureMessage("Error fetching cities: " + e.getMessage());
            log.error("Error in getAllCities", e);
        }
        return response;
    }
}
