package com.roboburger.core.dto;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@ToString
@Getter
@Setter
public class CouponDTO  {
    private Integer couponId;
    private Date couponCreatedAt;
    private Date couponExpiresAt;
    private String couponCode;
    private Integer discountPercentage;
    private Integer multiUse;
    private String redeemedAt;
   
}
