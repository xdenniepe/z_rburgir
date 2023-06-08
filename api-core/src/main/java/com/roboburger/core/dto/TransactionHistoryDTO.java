package com.roboburger.core.dto;

import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@ToString
@Getter
@Setter
public class TransactionHistoryDTO {
    
    private List<TransactionHistoryItemDTO> activeOrders;
    private List<TransactionHistoryItemDTO> pastOrders;
}
