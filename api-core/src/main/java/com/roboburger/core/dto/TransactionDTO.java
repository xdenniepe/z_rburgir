package com.roboburger.core.dto;

import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@ToString
@Getter
@Setter
public class TransactionDTO {
    private Integer transactionId;
    private Integer userId;
    private Integer couponId;
    private Integer orderId;
    private String code;
    private Double subtotal;
    private Double total;
    private Double fees;
    private Integer timestamp;
    private VendingMachineDTO vendingMachine;
    private PaymentDTO payment;
    private List<TransactionItemDTO> transactionItems;
}
