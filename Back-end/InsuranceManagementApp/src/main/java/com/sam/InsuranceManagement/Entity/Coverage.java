package com.sam.InsuranceManagement.Entity;

import jakarta.persistence.*;
import lombok.*;

@NamedQuery(
        name = "Coverage.findUnusedCoverages",
        query = "SELECT c FROM Coverage c WHERE c.coverageId NOT IN (SELECT p.coverage.coverageId FROM Policy p)"
)

@Entity
@Table(name = "coverage_master")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Coverage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int coverageId;

    @Column(nullable = false, unique = true)
    private String coverageName;
}
