package com.sam.InsuranceManagement.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "PolicyType_Master")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PolicyType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "type_id")
    private int typeId;

    @Column(name = "type_name", nullable = false)
    private String typeName;
}
