package com.roboburger.inventory.service;

import com.roboburger.core.dto.CouponDTO;
import com.roboburger.core.dto.TransactionItemDTO;
import com.roboburger.inventory.entity.Coupon;
import com.roboburger.inventory.mapper.CouponCodeMapper;
import com.roboburger.inventory.repository.CouponRepository;

import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class CouponService {

    @Autowired
    private CouponRepository couponRepository;

    private static final CouponCodeMapper couponCodeMapper = CouponCodeMapper.INSTANCE;

    public ResponseEntity<Coupon> getCouponByCode(String code) {
        Coupon coupon = couponRepository.findByCode(code).orElse(null);

        return ResponseEntity.ok(coupon);
    }

    public ResponseEntity<Coupon> getCouponById(Integer couponId) {
        Coupon coupon = couponRepository.findById(couponId).orElse(null);
        HttpStatus status;
        if (coupon == null) {
            status = HttpStatus.NOT_FOUND;
        } else {
            status = HttpStatus.OK;
        }

        return new ResponseEntity<>(coupon, status);
    }

    public List<CouponDTO> addPromoCode(List<CouponDTO> couponDTO)  {
        
        List<CouponDTO> coupoResponse;
        List<Coupon> coupons = couponRepository.saveAll(couponDTO.stream().map(couponCodeMapper::dtoToEntity).collect(Collectors.toList()));

        coupoResponse = coupons.stream().map(couponCodeMapper::entityToDto).collect(Collectors.toList());

        return coupoResponse;
    }

    public List<CouponDTO> convertPromoCodes(List<TransactionItemDTO> transactionItems) {

        return transactionItems.stream().map(ti -> {
            CouponDTO coupon = new CouponDTO();
            coupon.setCouponCode(ti.getCode());
            coupon.setDiscountPercentage(100);
            coupon.setMultiUse(0);

            return coupon;
        }).collect(Collectors.toList());
    }

    public List<CouponDTO> findCouponCodes(List<String> couponCodes) {
        log.info("Coupon codes: {}", couponCodes);
        List<Coupon> coupons = couponRepository.findCouponCodes(couponCodes); 

        return coupons.stream().map(couponCodeMapper::entityToDto).collect(Collectors.toList());
    }

}
