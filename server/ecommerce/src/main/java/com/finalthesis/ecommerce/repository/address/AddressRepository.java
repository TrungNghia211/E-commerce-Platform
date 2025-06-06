package com.finalthesis.ecommerce.repository.address;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.finalthesis.ecommerce.entity.Address;

@Repository
public interface AddressRepository extends JpaRepository<Address, Integer> {}
