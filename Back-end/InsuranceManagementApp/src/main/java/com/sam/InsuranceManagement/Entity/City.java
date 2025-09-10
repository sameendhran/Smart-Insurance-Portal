package com.sam.InsuranceManagement.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "City_Master")
@Data
@NoArgsConstructor
@AllArgsConstructor
@NamedQuery(
        name = "City.findByCityName",
        query = "SELECT c FROM City c WHERE LOWER(c.cityName) = LOWER(:cityName)"
) // Named query to find city by name ignoring case
public class City {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "city_id")
    private int cityId;

    @Column(name = "city_name", nullable = false)
    private String cityName;
}
