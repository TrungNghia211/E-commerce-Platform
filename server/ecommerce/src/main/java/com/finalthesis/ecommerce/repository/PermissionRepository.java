package com.finalthesis.ecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.finalthesis.ecommerce.entity.Permission;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, String> {}
