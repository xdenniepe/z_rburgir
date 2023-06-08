package com.roboburger.core.dto;

import java.util.List;

import lombok.*;

@Data
public class InvoicePdfDTO {
    private PaymentDTO paymentInfo;
    private TransactionDTO transaction;
    private List<CartItemDTO> items;
    private Double discount;
    private String coupon;
    private String transactionDate;
    private String cardNum;
    private String receiptUrl;
    private String postal;
    private String redirectUrl;
}
