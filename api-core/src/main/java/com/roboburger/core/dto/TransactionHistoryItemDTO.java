package com.roboburger.core.dto;

import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@ToString
@Getter
@Setter
public class TransactionHistoryItemDTO {
   
    private Integer userId;
    private Integer orderId;
    private String transactionDate;
    private List<CartItemDTO> cartItems;
    
}
