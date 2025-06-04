package com.finalthesis.ecommerce.entity;

import java.time.LocalDateTime;
import java.util.Set;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Shop {
    @Id
    Integer id;

    @Column(unique = true)
    String name;

    String phone;

    String avatar;

    @Column(columnDefinition = "TEXT")
    String description;

    String bankName;

    String bankAccountNumber;

    String bankAccountHolderName;

    @CreationTimestamp
    LocalDateTime createdAt;

    @CreationTimestamp
    LocalDateTime updatedAt;

    @OneToOne
    @JoinColumn(name = "address_id", referencedColumnName = "id")
    Address address;

    @OneToOne(mappedBy = "shop")
    User user;

    @OneToMany(mappedBy = "shop")
    Set<Product> products;

    @OneToMany(mappedBy = "shop")
    Set<Order> orders;
}
