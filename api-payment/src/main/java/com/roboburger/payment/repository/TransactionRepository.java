package com.roboburger.payment.repository;

import java.util.List;
import java.util.Optional;

import com.roboburger.payment.entity.Transaction;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;


// For now, POST method creates a transaction record that has code(QR) to be used for testing
// Once a payment method has been decided every request needs to be filtered and validated with the payment service used
// Filtering: request should only come from a trusted service within the VPC
// Validating: use the paymentId to make a request to the payment method to see whether the transaction is legit.
//             event handler can probably be used provided that it can stop the creation of record when payment is invalid
@RepositoryRestResource
public interface TransactionRepository extends JpaRepository<Transaction, Integer> {
  @Query(value = "SELECT COUNT(*) FROM [transaction]", nativeQuery = true)
  long count();

  Optional<Transaction> findByOrderId(Integer orderId);
  
  @Query(value = "SELECT a FROM Transaction a JOIN a.transactionItems b WHERE a.orderId = :orderId")
  Optional<Transaction> findTransactionByOrderId(Integer orderId);

  List<Transaction> findByUserId(Integer userId);

  List<Transaction> findByUserIdOrderByTimestampDesc(Integer userId);
}
