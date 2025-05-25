package com.finalthesis.ecommerce.repository.address;

import com.finalthesis.ecommerce.entity.Ward;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WardRepository extends JpaRepository<Ward, Integer> {
}
