package com.roboburger.payment.controller.request;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CouponRequest {
    private Integer couponId;
    private String couponCode;
    private Integer amount;
    private Integer percentage;
    private Integer timesUsed;
    private Integer expirationDate;
    private String status;
}
