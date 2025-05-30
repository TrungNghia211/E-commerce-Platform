package com.finalthesis.ecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.finalthesis.ecommerce.entity.ProductItem;

@Repository
public interface ProductItemRepository extends JpaRepository<ProductItem, Integer> {}
