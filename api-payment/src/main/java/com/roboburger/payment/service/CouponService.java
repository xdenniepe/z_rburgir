package com.roboburger.payment.service;

import com.roboburger.core.dto.CouponDTO;
import com.roboburger.core.utility.Utility;

import com.roboburger.payment.apiservice.InventoryApiService;

import jdk.jshell.execution.Util;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
@Slf4j
@Service
public class CouponService {


    @Autowired
    InventoryApiService inventoryApiService;

    /**
     * 
     * @param coupon
     * @param total
     * @return
     */
    public Double applyCoupon(CouponDTO coupon, Double total) {
        if (coupon != null) {
            double discountValue = Utility.formatDouble(total * ((double) coupon.getDiscountPercentage() / 100), 2);
            log.info("Total Value: {}", total);
            log.info("Discount Value: {}", discountValue);
            return Utility.formatDouble(total - discountValue , 2);
        } else {
            return Utility.formatDouble(total, 2);
        }
    }

    /**
     * 
     * @param couponCode
     * @return
     */
    public CouponDTO checkCoupon(String couponCode) {

        if (couponCode != null) {
            CouponDTO coupon = inventoryApiService.getCoupon(couponCode);
            if(coupon != null) {
                return coupon;
            }
        }
        return null;
    }

    /**
     *
     * @param couponId
     * @return
     */
    public CouponDTO getCouponById(Integer couponId) {

        if (couponId != null) {
            CouponDTO coupon = inventoryApiService.getCouponById(couponId);
            if(coupon != null) {
                return coupon;
            }
        }
        return null;
    }
}
