package com.finalthesis.ecommerce.repository.address;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.finalthesis.ecommerce.entity.Province;

@Repository
public interface ProvinceRepository extends JpaRepository<Province, Integer> {}
