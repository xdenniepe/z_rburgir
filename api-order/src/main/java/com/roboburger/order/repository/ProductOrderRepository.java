package com.roboburger.order.repository;

import java.util.List;
import java.util.Optional;

import com.roboburger.order.entity.ProductOrder;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource
public interface ProductOrderRepository extends JpaRepository<ProductOrder, Integer> {
  @Query(value = "SELECT COUNT(*) FROM [product_order]", nativeQuery = true)
  long count();

  @Query(value = "SELECT a FROM ProductOrder a JOIN a.order b WHERE b.orderId = :orderId and a.productId = :productId ORDER BY a.productOrderId DESC")
  Optional<ProductOrder> findByProductAndOrderID(int orderId, int productId);

  @Query(value = "SELECT SUM(a.quantity) FROM ProductOrder a JOIN a.order b WHERE b.orderId = :orderId AND b.status = 'PENDING' GROUP BY b.orderId")
  Optional<ProductOrder> findCartQuantity(int orderId);

  @Query(value = "SELECT * FROM [product_order] WHERE order_id = :orderId", nativeQuery = true)
  List<ProductOrder> findByOrderId(int orderId);

  @Query(value = "SELECT * FROM [product_order] WHERE product_order_id = :productOrderId", nativeQuery = true )
  Optional<ProductOrder> findByProudctOrderId(int productOrderId);
}
