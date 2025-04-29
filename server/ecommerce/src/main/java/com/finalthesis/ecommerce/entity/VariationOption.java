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
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "variation_id", nullable = false)
    private Variation variation;

    @Column(nullable = false)
    private String value;

    @ManyToMany(mappedBy = "variationOptions")
    private List<ProductItem> productItems;

}
