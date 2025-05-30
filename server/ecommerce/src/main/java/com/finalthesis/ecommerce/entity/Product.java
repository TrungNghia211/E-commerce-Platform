package com.finalthesis.ecommerce.entity;

import java.time.LocalDateTime;
import java.util.List;

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
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    String name;

    @Column(nullable = false, unique = true)
    String slug;

    @Column(columnDefinition = "integer default 0")
    Integer quantityInStock;

    @Column(nullable = false)
    Double price;

    Integer buyTurn;

    @Column(columnDefinition = "TEXT")
    String description;

    Double weight;

    Integer length;

    Integer width;

    Integer height;

    String thumbnail;

    @Column(columnDefinition = "integer default 0")
    Integer purchaseCount;

    @CreationTimestamp
    @Column(updatable = false)
    LocalDateTime createdAt;

    @UpdateTimestamp
    LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", referencedColumnName = "id")
    ProductCategory category;

    @OneToMany(mappedBy = "product", cascade = CascadeType.PERSIST)
    List<ProductItem> productItems;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    List<Variation> variations;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shop_id", referencedColumnName = "id")
    Shop shop;
}
