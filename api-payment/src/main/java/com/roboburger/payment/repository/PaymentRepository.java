package com.roboburger.payment.repository;

import com.roboburger.payment.entity.Payment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;


// For now, POST method creates a transaction record that has code(QR) to be used for testing
// Once a payment method has been decided every request needs to be filtered and validated with the payment service used
// Filtering: request should only come from a trusted service within the VPC
// Validating: use the paymentId to make a request to the payment method to see whether the transaction is legit.
//             event handler can probably be used provided that it can stop the creation of record when payment is invalid
@RepositoryRestResource
public interface PaymentRepository extends JpaRepository<Payment, Integer> {
  @Query(value = "SELECT TOP 1 * FROM payment where transaction_id = :transactionId ", nativeQuery = true)
  Payment findByTransactionId(Integer transactionId);

  @Query(value = "SELECT COUNT(*) FROM [payment]", nativeQuery = true)
  long count();
}
