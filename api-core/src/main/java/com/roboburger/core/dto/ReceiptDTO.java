package com.roboburger.core.dto;

import lombok.*;
@Getter
@Setter
public class ReceiptDTO {
    private Integer orderId;
    private Integer userId;
    private String paymentEmail;
    private String phoneNumber;
    private Double subtotal;
    private Double fees;
    private Double total;
    private InvoicePdfDTO invoicePdf;
} 