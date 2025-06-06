package com.finalthesis.ecommerce.repository.address;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.finalthesis.ecommerce.entity.District;

@Repository
public interface DistrictRepository extends JpaRepository<District, Integer> {}
