package com.finalthesis.ecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.finalthesis.ecommerce.entity.Shop;

@Repository
public interface ShopRepository extends JpaRepository<Shop, Integer> {}
