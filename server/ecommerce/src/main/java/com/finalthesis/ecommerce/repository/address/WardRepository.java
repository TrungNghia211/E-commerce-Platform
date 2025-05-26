package com.finalthesis.ecommerce.repository.address;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.finalthesis.ecommerce.entity.Ward;

@Repository
public interface WardRepository extends JpaRepository<Ward, Integer> {}
