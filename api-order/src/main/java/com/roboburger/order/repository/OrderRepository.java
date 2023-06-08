package com.roboburger.order.repository;

import java.util.List;
import java.util.Optional;

import com.roboburger.order.entity.Order;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource
public interface OrderRepository extends JpaRepository<Order, Integer> {
  @Query(value = "SELECT COUNT(*) FROM [order]", nativeQuery = true)
  long count();

  @Query(value = "SELECT TOP 1 * FROM [order] WHERE user_id = :userId AND status = 'PENDING' ORDER BY [order_id] ASC ", nativeQuery = true)
  Optional<Order>  findByUserId(int userId);

  @Query(value = "SELECT TOP 1 * FROM [order] WHERE order_id = :orderId ", nativeQuery = true)
  Optional<Order>  findByOrderId(Integer orderId);

  @Query(value = "SELECT TOP 1 * FROM [order] WHERE user_id = :userId AND status = 'COMPLETED' ORDER BY [order_id] DESC ", nativeQuery = true)
  Optional<Order>  findLastOrder(Integer userId);

  @Query(value = "SELECT * FROM [order] WHERE user_id = :userId AND status = 'COMPLETED' ORDER BY when_added DESC", nativeQuery = true)
  List<Order>  findAllCompletedByUserId(Integer userId);


}
