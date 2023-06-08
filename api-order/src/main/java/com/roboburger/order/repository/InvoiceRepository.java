package com.roboburger.order.repository;


import java.util.List;
import java.util.UUID;

import com.roboburger.order.entity.Invoice;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource
public interface InvoiceRepository extends JpaRepository<Invoice, UUID> {
  
  @Query(value = "SELECT i.* FROM [invoice] i WHERE i.order_id = :orderId", nativeQuery = true)
  List<Invoice> findByOrderId(Integer orderId);

}
