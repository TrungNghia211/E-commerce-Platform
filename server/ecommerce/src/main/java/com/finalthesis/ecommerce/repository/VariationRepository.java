package com.finalthesis.ecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.finalthesis.ecommerce.entity.Variation;

public interface VariationRepository extends JpaRepository<Variation, Integer> {}
