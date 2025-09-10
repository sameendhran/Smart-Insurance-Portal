    package com.sam.InsuranceManagement.DAO;

    import com.sam.InsuranceManagement.Entity.Coverage;
    import org.springframework.data.jpa.repository.JpaRepository;
    import org.springframework.stereotype.Repository;

    import java.util.List;

    @Repository
    public interface CoverageRepository extends JpaRepository<Coverage, Integer> {

        // Correct field name used below:
        List<Coverage> findByCoverageNameIgnoreCase(String coverageName);
    }
