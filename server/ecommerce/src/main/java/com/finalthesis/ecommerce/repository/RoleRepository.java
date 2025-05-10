package com.finalthesis.ecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.finalthesis.ecommerce.entity.Role;

@Repository
public interface RoleRepository extends JpaRepository<Role, String> {}
