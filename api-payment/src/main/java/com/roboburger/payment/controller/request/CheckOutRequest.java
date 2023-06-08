package com.roboburger.payment.controller.request;

import com.roboburger.core.dto.InvoicePdfDTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CheckOutRequest {
    Integer orderId;
    String paymentMethod;
    String couponCode;
    String paymentEmail;
    String phoneNumber;
    InvoicePdfDTO invoicePdf;
    String cardNum;
}
