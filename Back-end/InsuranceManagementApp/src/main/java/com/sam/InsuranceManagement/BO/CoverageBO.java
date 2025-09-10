package com.sam.InsuranceManagement.BO;

import com.sam.InsuranceManagement.DAO.CoverageRepository;
import com.sam.InsuranceManagement.DTO.coverage.CoverageRequestDTO;
import com.sam.InsuranceManagement.DTO.coverage.CoverageResponseDTO;
import com.sam.InsuranceManagement.Entity.Coverage;
import com.sam.InsuranceManagement.Exception.CoverageException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class CoverageBO {

    private final CoverageRepository repo;


    public CoverageResponseDTO addCoverage(CoverageRequestDTO dto) throws CoverageException {
        Coverage coverage = mapRequestToEntity(dto);  // map DTO → Entity
        validateCoverage(coverage);                   // validate

        // === Check for duplicate coverage name  ===
        List<Coverage> existing = repo.findByCoverageNameIgnoreCase(coverage.getCoverageName());
        if (!existing.isEmpty()) {
            throw new CoverageException("Coverage with name '" + coverage.getCoverageName() + "' already exists.");
        }

        coverage = repo.save(coverage);               // save
        return mapEntityToResponse(coverage);         // map Entity → ResponseDTO
    }


    public CoverageResponseDTO updateCoverage(int id, CoverageRequestDTO dto) throws CoverageException {
        Coverage existing = repo.findById(id)
                .orElseThrow(() -> new CoverageException("Coverage not found with ID: " + id));

        existing.setCoverageName(dto.getCoverageName());
        validateCoverage(existing);

        /*
         Check for duplicates with other IDs (case-insensitive)
         there Existing in DB: "Health Insurance" with ID = 1
        You try to update ID = 2 to "health insurance"
        */
        List<Coverage> dupList = repo.findByCoverageNameIgnoreCase(existing.getCoverageName());
        if (!dupList.isEmpty() && dupList.get(0).getCoverageId() != id) {
            throw new CoverageException("Another coverage with the same name already exists.");
        }

        existing = repo.save(existing);
        return mapEntityToResponse(existing);
    }


    public List<CoverageResponseDTO> getAllCoverages() throws CoverageException {
        List<Coverage> list = repo.findAll();
        if (list.isEmpty()) {
            throw new CoverageException("No coverages found.");
        }
        return list.stream().map(this::mapEntityToResponse).collect(Collectors.toList());
    }

    public CoverageResponseDTO getCoverageById(int id) throws CoverageException {
        Coverage coverage = repo.findById(id)
                .orElseThrow(() -> new CoverageException("Coverage not found with ID: " + id));
        return mapEntityToResponse(coverage);
    }

    // ===== JPQL queries =====
    public List<CoverageResponseDTO> getCoveragesByNameIgnoreCase(String coverageName) throws CoverageException {
        List<Coverage> list = repo.findByCoverageNameIgnoreCase(coverageName);
        if (list.isEmpty()) {
            throw new CoverageException("No coverages found with name: " + coverageName);
        }
        return list.stream().map(this::mapEntityToResponse).collect(Collectors.toList());
    }

    // === Helper Mappers ===
    private Coverage mapRequestToEntity(CoverageRequestDTO dto) {
        Coverage coverage = new Coverage();
        coverage.setCoverageName(dto.getCoverageName());
        return coverage;
    }

    private CoverageResponseDTO mapEntityToResponse(Coverage coverage) {
        CoverageResponseDTO dto = new CoverageResponseDTO();
        dto.setCoverageId(coverage.getCoverageId());
        dto.setCoverageName(coverage.getCoverageName());
        return dto;
    }

    private void validateCoverage(Coverage coverage) throws CoverageException {
        String name = coverage.getCoverageName();

        if (name != null) {
            coverage.setCoverageName(name.trim()); // trim leading/trailing whitespace
        }

        if (isBlank(coverage.getCoverageName())) {
            throw new CoverageException("Coverage name is required.");
        }

        if (coverage.getCoverageName().length() > 100) {
            throw new CoverageException("Coverage name must not exceed 100 characters.");
        }

        if (!coverage.getCoverageName().matches("[a-zA-Z0-9 ]+")) {
            throw new CoverageException("Coverage name contains invalid characters.");
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
}
