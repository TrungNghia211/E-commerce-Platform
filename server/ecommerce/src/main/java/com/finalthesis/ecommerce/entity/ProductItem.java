package com.finalthesis.ecommerce.entity;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @Column(name = "SKU", nullable = false, unique = true)
    String sku;

    @Column(columnDefinition = "integer default 0")
    Integer quantityInStock;

    @Column(nullable = false)
    Double price;

    String thumbnail;

    @CreationTimestamp
    @Column(updatable = false)
    LocalDateTime createdAt;

    @UpdateTimestamp
    LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", referencedColumnName = "id")
    Product product;

    @ManyToMany(cascade = CascadeType.PERSIST)
    @JoinTable(
            name = "product_configuration",
            joinColumns = @JoinColumn(name = "product_item_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "variation_option_id", referencedColumnName = "id"))
    Set<VariationOption> variationOptions = new HashSet<>();

    @OneToMany(mappedBy = "productItem", cascade = CascadeType.ALL)
    Set<Order> order;
}
