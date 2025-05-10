package com.finalthesis.ecommerce.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

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
