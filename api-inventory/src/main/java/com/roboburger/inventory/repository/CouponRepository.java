package com.roboburger.inventory.repository;

import com.roboburger.inventory.entity.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CouponRepository extends JpaRepository<Coupon, Integer> {

   @Query(value = "SELECT a FROM Coupon a WHERE a.couponCode = :code AND unitID_redeemedAt is NULL")
   Optional<Coupon> findByCode(String code);

   @Query(value = "SELECT a FROM Coupon a WHERE a.couponId = :couponId AND unitID_redeemedAt is NULL")
   Optional<Coupon> findById(Integer couponId);

   @Query(value = "SELECT a FROM Coupon a WHERE unitID_redeemedAt is NULL AND a.couponCode IN(:couponCodes)")
   List<Coupon> findCouponCodes(List<String> couponCodes);
}
