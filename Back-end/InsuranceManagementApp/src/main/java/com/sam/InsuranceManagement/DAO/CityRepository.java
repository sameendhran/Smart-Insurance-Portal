package com.sam.InsuranceManagement.DAO;

import com.sam.InsuranceManagement.Entity.City;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CityRepository extends JpaRepository<City, Integer> {

    // Use a named query to fetch city by name (case-insensitive)
    @Query(name = "City.findByCityName")
    List<City> findByCityNameIgnoreCase(@Param("cityName") String cityName);
}
