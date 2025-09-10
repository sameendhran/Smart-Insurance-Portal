package com.sam.InsuranceManagement.DAO;

import com.sam.InsuranceManagement.Entity.City;
import com.sam.InsuranceManagement.Entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Integer> {

    // Find customers by city
    @Query("SELECT c FROM Customer c WHERE c.city.cityName = :cityName")
    List<Customer> findByCityName(@Param("cityName") String cityName);

    // Find customers by gender
    @Query("SELECT c FROM Customer c WHERE c.gender = :gender")
    List<Customer> findByGender(@Param("gender") char gender);

    // Find customers born before a certain date
    @Query("SELECT c FROM Customer c WHERE c.dob < :date")
    List<Customer> findBornBefore(@Param("date") Date date);

    // Count customers in a city
    @Query("SELECT COUNT(c) FROM Customer c WHERE c.city.cityName = :cityName")
    long countByCityName(@Param("cityName") String cityName);


    @Query("SELECT DISTINCT c FROM Customer c JOIN c.policies p WHERE p.premium > :amount")
    List<Customer> findCustomersWithPremiumAbove(@Param("amount") double amount);

    @Query("""
    SELECT DISTINCT c 
    FROM Customer c 
    JOIN c.policies p 
    JOIN p.policyType pt 
    WHERE pt.typeName = :typeName
""")
    List<Customer> findCustomersByPolicyType(@Param("typeName") String typeName);

    @Query("SELECT c FROM Customer c WHERE c.occupationId = :occupationId")
    List<Customer> findByOccupationId(@Param("occupationId") int occupationId);

    // Find customers created after a particular date
    @Query("SELECT c FROM Customer c WHERE c.dob > :date")
    List<Customer> findCustomersBornAfter(@Param("date") Date date);

    @Query("SELECT c FROM Customer c WHERE c.policies IS EMPTY")
    List<Customer> findCustomersWithNoPolicies();


}

