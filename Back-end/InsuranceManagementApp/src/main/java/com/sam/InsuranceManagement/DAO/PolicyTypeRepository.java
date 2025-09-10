package com.sam.InsuranceManagement.DAO;

import com.sam.InsuranceManagement.Entity.PolicyType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PolicyTypeRepository extends JpaRepository<PolicyType, Integer> {

    // Get all policy types where the type name matches (case-insensitive)
    @Query("SELECT pt FROM PolicyType pt WHERE LOWER(pt.typeName) = LOWER(:name)")
    List<PolicyType> findByTypeNameIgnoreCase(@Param("name") String name);


}
