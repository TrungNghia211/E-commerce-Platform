package com.finalthesis.ecommerce.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.finalthesis.ecommerce.entity.CartItem;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Integer> {
    List<CartItem> findByCartId(Integer cartId);

    @Query("SELECT ci FROM CartItem ci " + "JOIN FETCH ci.productItem pi "
            + "JOIN FETCH pi.product p "
            + "JOIN FETCH p.shop s "
            + "LEFT JOIN FETCH pi.variationOptions vo "
            + "LEFT JOIN FETCH vo.variation v "
            + "WHERE ci.cart.id = :cartId")
    List<CartItem> findByCartIdWithDetails(@Param("cartId") Integer cartId);
}
