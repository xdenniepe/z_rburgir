package com.roboburger.payment.repository;

import com.roboburger.payment.entity.TransactionItem;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource
public interface TransactionItemRepository extends JpaRepository<TransactionItem, Integer> {

    @Query(value = "SELECT a.code FROM TransactionItem a JOIN a.transaction b WHERE b.userId = :userId")
    List<String> findByOrderId(Integer userId);

}
