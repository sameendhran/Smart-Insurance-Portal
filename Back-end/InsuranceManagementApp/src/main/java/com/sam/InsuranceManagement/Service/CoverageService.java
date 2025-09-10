package com.sam.InsuranceManagement.Service;

import com.sam.InsuranceManagement.BO.CoverageBO;
import com.sam.InsuranceManagement.DTO.coverage.CoverageRequestDTO;
import com.sam.InsuranceManagement.DTO.coverage.CoverageResponseDTO;
import com.sam.InsuranceManagement.Exception.CoverageException;
import com.sam.InsuranceManagement.Response.ResponseObject;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class CoverageService {

    private static final String ERROR_PREFIX = "Error: ";

    private final CoverageBO bo;

    public ResponseObject addCoverage(CoverageRequestDTO dto) {
        ResponseObject response = new ResponseObject();
        try {
            CoverageResponseDTO coverageDTO = bo.addCoverage(dto);
            response.setCoverageDTO(coverageDTO);
            response.setSuccessMessage("Coverage added successfully");
        } catch (CoverageException e) {
            response.setFailureMessage(ERROR_PREFIX + e.getMessage());
            log.error("Error in addCoverage", e);
        }
        return response;
    }

    public ResponseObject updateCoverage(int id, CoverageRequestDTO dto) {
        ResponseObject response = new ResponseObject();
        try {
            if (id <= 0) { // added to avoid negative or zero ID
                throw new CoverageException("Invalid coverage ID.");
            }

            CoverageResponseDTO updatedDTO = bo.updateCoverage(id, dto);
            response.setCoverageDTO(updatedDTO);
            response.setSuccessMessage("Coverage updated successfully");
        } catch (CoverageException e) {
            response.setFailureMessage(ERROR_PREFIX + e.getMessage());
            log.error("Error in updateCoverage", e);
        }
        return response;
    }

    public ResponseObject getAllCoverages() {
        ResponseObject response = new ResponseObject();
        try {
            List<CoverageResponseDTO> listDTO = bo.getAllCoverages();
            response.setCoverageListDTO(listDTO);
        } catch (CoverageException e) {
            response.setFailureMessage("Error fetching coverage list: " + e.getMessage());
            log.error("Error in getAllCoverages", e);
        }
        return response;
    }

    public ResponseObject getCoverageById(int id) {
        ResponseObject response = new ResponseObject();
        try {
            if (id <= 0) { // added to validate ID before DB lookup
                throw new CoverageException("Invalid coverage ID.");
            }

            CoverageResponseDTO coverageDTO = bo.getCoverageById(id);
            response.setCoverageDTO(coverageDTO);
        } catch (CoverageException e) {
            response.setFailureMessage(ERROR_PREFIX + e.getMessage());
            log.error("Error in getCoverageById", e);
        }
        return response;
    }

    public ResponseObject getCoverageByNameIgnoreCase(String name) {
        ResponseObject response = new ResponseObject();
        try {
            List<CoverageResponseDTO> list = bo.getCoveragesByNameIgnoreCase(name);
            response.setCoverageListDTO(list);
            response.setSuccessMessage("Coverage(s) found for name: " + name);
        } catch (CoverageException e) {
            response.setFailureMessage(ERROR_PREFIX + e.getMessage());
            log.error("Error in getCoverageByNameIgnoreCase", e);
        }
        return response;
    }
}

