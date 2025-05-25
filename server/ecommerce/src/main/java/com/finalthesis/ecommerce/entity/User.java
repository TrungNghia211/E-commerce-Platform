package com.finalthesis.ecommerce.entity;

import java.time.LocalDateTime;
import java.util.Set;

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
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    // Case Sensitive
    @Column(unique = true, columnDefinition = "VARCHAR(255) COLLATE utf8mb4_unicode_ci")
    String username;

    String password;

    String fullName;

    @Column(unique = true)
    String email;

    @Column(unique = true)
    String phone;

    LocalDateTime createdAt;

    LocalDateTime updatedAt;

    @Column(
            columnDefinition =
                    "varchar(255) default 'https://res.cloudinary.com/dm1ozebjy/image/upload/v1747726753/anonymousUser_ilohpg.jpg'")
    String avatar;

    String citizenIdFrontImage;

    String citizenIdBackImage;

    @ManyToMany
    @JoinTable(
            name = "user_role",
            joinColumns = @JoinColumn(name = "user_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "role_name", referencedColumnName = "name"))
    Set<Role> roles;

    @OneToOne(mappedBy = "user")
    Shop shop;
}
