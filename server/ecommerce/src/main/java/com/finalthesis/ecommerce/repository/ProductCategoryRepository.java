package com.finalthesis.ecommerce.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.finalthesis.ecommerce.entity.ProductCategory;

@Repository
public interface ProductCategoryRepository extends JpaRepository<ProductCategory, Integer> {
    List<ProductCategory> findTop8ByOrderByCreatedAtDesc();

    boolean existsByName(String name);

    boolean existsBySlug(String slug);

    List<ProductCategory> findByParentCategoryIdIsNull();
}
