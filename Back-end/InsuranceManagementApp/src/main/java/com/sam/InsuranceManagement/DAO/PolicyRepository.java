package com.sam.InsuranceManagement.DAO;

import com.sam.InsuranceManagement.Entity.Policy;
import com.sam.InsuranceManagement.Projection.PolicyBasicInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface PolicyRepository extends JpaRepository<Policy, Integer> {

    List<Policy> findByCustomerCustomerId(int customerId);

    @Query("SELECT p FROM Policy p WHERE p.premium > :premium")
    List<Policy> findByPremiumGreaterThan(@Param("premium") double premium);

    @Query("SELECT p FROM Policy p WHERE p.createdDate BETWEEN :startDate AND :endDate")
    List<Policy> findPoliciesByCreatedDateBetween(@Param("startDate") Date startDate, @Param("endDate") Date endDate);

    @Query("SELECT p FROM Policy p WHERE LOWER(p.customer.firstName) = LOWER(:name)")
    List<Policy> findByCustomerFirstNameIgnoreCase(@Param("name") String name);

    @Query("SELECT p FROM Policy p WHERE p.customer.gender = :gender")
    List<Policy> findPoliciesByCustomerGender(@Param("gender") char gender);

    // This query is based on the confirmed structure: Policy -> Customer -> City -> cityName (String)
    @Query("SELECT p FROM Policy p WHERE LOWER(p.customer.city.cityName) = LOWER(:cityName)")
    List<Policy> findByCustomerCityNameIgnoreCase(@Param("cityName") String cityName);

    // This is the CRITICAL method for sequential policy number generation.
    @Query("SELECT p.policyNumber FROM Policy p WHERE p.policyNumber LIKE 'POL%' ORDER BY CAST(SUBSTRING(p.policyNumber, 4) AS long) DESC LIMIT 1")
    Optional<String> findTopByPolicyNumberStartingWithPOLOrderByPolicyNumberDesc();

    // --- ADD THIS NEW METHOD ---
    @Query("SELECT p FROM Policy p JOIN FETCH p.customer c JOIN FETCH c.city")
    List<Policy> findAllWithCustomerAndCity();
    // --- END NEW METHOD ---

    // --- PROJECTIONS AND AGGREGATE METHODS ---
    @Query("SELECT p.policyId as policyId, p.policyNumber as policyNumber, p.premium as premium, p.policyType.typeName as policyTypeName FROM Policy p")
    List<PolicyBasicInfo> fetchBasicPolicyInfo();

    @Query("SELECT COUNT(p) FROM Policy p")
    Long countTotalPolicies();

    @Query("SELECT SUM(p.premium) FROM Policy p")
    Double sumAllPremiums();

    @Query("SELECT p.customer.city.cityName, COUNT(p) FROM Policy p GROUP BY p.customer.city.cityName")
    List<Object[]> countPoliciesByCity();
}