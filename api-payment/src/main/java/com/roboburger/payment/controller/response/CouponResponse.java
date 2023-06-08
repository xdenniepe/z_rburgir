package com.roboburger.payment.controller.response;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CouponResponse {

    private Integer couponId;
    private String couponCode;
    private String status;
    private Integer timesUsed;
    private Integer expirationDate;
    private Integer amount;
    private Integer percentage;
}