package com.finalthesis.ecommerce.entity;

import java.util.List;

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
public class VariationOption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @ManyToOne
    @JoinColumn(name = "variation_id", nullable = false)
    Variation variation;

    @Column(nullable = false)
    String value;

    @ManyToMany(mappedBy = "variationOptions")
    List<ProductItem> productItems;
}
