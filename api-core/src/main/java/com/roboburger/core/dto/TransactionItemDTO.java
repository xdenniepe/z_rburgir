package com.roboburger.core.dto;

import lombok.*;

@Getter
@Setter
public class TransactionItemDTO {
    private Integer transactionItemId;
    private Integer productId;
    private String itemDescription;
    private Double itemPrice;
    private Integer itemQuantity;
    private Double itemTax;
    private Double itemTotalCost;
    private String productName;
    private String code;
    private Boolean active;
}