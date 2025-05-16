package com.finalthesis.ecommerce.entity;

import java.time.LocalDateTime;
import java.util.List;
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
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    //    @Column(name = "parent_category_id")
    //    Integer parentCategoryId;

    @Column(nullable = false)
    String name;

    @Column(nullable = false, unique = true)
    String slug;

    //    @Column(columnDefinition = "TEXT")
    //    String description;

    String thumbnail;

    boolean visible;

    @CreationTimestamp
    @Column(updatable = false)
    LocalDateTime createdAt;

    @UpdateTimestamp
    LocalDateTime updatedAt;

    @OneToMany(mappedBy = "category")
    List<Product> products;

    @ManyToOne
    @JoinColumn(name = "parent_category_id", referencedColumnName = "id")
    ProductCategory parentCategory;

    @OneToMany(mappedBy = "parentCategory", cascade = CascadeType.ALL)
    Set<ProductCategory> subCategories;
}
