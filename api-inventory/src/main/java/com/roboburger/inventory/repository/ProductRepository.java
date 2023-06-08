package com.roboburger.inventory.repository;

import com.roboburger.inventory.entity.Product;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.Optional;

@RepositoryRestResource
public interface ProductRepository extends JpaRepository<Product, Integer> {

    @Query("SELECT a FROM Product a WHERE a.productId = :productId")
    Optional<Product> findByProductId(Integer productId);

}
