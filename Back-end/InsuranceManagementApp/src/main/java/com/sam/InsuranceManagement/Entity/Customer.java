package com.sam.InsuranceManagement.Entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "customers")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor

@AllArgsConstructor
@ToString(exclude = "policies") // Prevent recursion in toString
// If you generate a toString() for Customer, it will also call toString() on each Policy.
//Each Policy will call toString() on its Customer.
//And that Customer will again call toString() on its policies.
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int customerId;

    private String firstName;
    private String lastName;
    private char gender;

    @Temporal(TemporalType.DATE)
    private Date dob;

    private String mobileNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "city_id", referencedColumnName = "city_id", nullable = false)
    private City city;

    private int stateId;
    private int countryId;
    private int occupationId;

    @CreatedDate
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at", nullable = false, updatable = false)
    private Date createdDate;

    @LastModifiedDate
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "updated_at")
    private Date updatedDate;

    @OneToMany(mappedBy = "customer", fetch = FetchType.LAZY)
    private List<Policy> policies;  //  Added this mapping for premium jpl query
}
