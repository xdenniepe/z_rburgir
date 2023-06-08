package com.roboburger.inventory.controller;

import com.roboburger.core.dto.CouponDTO;
import com.roboburger.core.dto.TransactionItemDTO;
import com.roboburger.inventory.entity.Coupon;
import com.roboburger.inventory.service.CouponService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CouponController {

    @Autowired
    private CouponService couponService;

    @GetMapping("/api/coupons")
    public ResponseEntity<Coupon> getCouponByCode(@RequestParam("code") String code) {
        return couponService.getCouponByCode(code);
    }

    @GetMapping("/api/coupons/findById")
    public ResponseEntity<Coupon> getCouponById(@RequestParam("couponId") Integer couponId) {
        return couponService.getCouponById(couponId);
    }

    @PostMapping("/api/coupons/addCoupon")
    public List<CouponDTO> convertTransaction(@RequestBody List<TransactionItemDTO> transactionItems) {
        List<CouponDTO> couponDTOs = couponService.convertPromoCodes(transactionItems);
        List<CouponDTO> coupons = couponService.addPromoCode(couponDTOs);

        return coupons; 
    }

    @PostMapping("/api/coupons/findCoupons")
    public List<CouponDTO> findCouponCodes(@RequestBody List<String> couponCodes) {
        List<CouponDTO> couponDTOs = couponService.findCouponCodes(couponCodes);
        
        return couponDTOs; 
    }
}
