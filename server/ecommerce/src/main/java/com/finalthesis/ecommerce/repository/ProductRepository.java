package com.finalthesis.ecommerce.repository;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.finalthesis.ecommerce.dto.response.HomepageProductResponse;
import com.finalthesis.ecommerce.entity.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

    @Query(
            value = "SELECT p.id, p.name, p.thumbnail, min(pi.price) AS price, p.buy_turn AS buyTurn "
                    + "FROM product p JOIN product_item pi "
                    + "ON p.id = pi.product_id "
                    + "GROUP BY p.id, p.thumbnail, p.name, p.buy_turn ",
            //                    + "ORDER BY p.buy_turn DESC",
            nativeQuery = true)
    Page<HomepageProductResponse> getHomepageProducts(Pageable pageable);

    Page<Product> findByShop_User_Username(String username, Pageable pageable);

    @EntityGraph(
            attributePaths = {
                "category",
                "shop",
                "productItems",
                "productItems.variationOptions",
                "variations",
                "variations.variationOptions"
            })
    Optional<Product> findWithAllDetailsById(Integer id);

    Long countByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);

    // Optionally, if you want to count products by shop as well:
    Long countByShopIdAndCreatedAtBetween(Integer shopId, LocalDateTime startDate, LocalDateTime endDate);

    Page<Product> findByNameContainingIgnoreCase(String name, Pageable pageable);
}
