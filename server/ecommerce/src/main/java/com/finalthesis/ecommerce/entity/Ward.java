package com.finalthesis.ecommerce.entity;

import java.util.Set;

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
public class Ward {
    @Id
    Integer id;

    String name;

    @OneToMany(mappedBy = "ward")
    Set<Address> addresses;
}
