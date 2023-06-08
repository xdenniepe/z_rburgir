package com.roboburger.core.dto;

import lombok.*;

@Getter
@Setter
public class ReceiptItemsDTO {
    private Integer productId;
    private Integer quantity;
    private Double totalCost;
}
