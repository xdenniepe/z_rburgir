package com.roboburger.core.dto;

import java.util.List;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import com.roboburger.core.enumerated.ProductTypesEnum;

import com.fasterxml.jackson.annotation.JsonInclude;

@ToString
@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ProductOrderDTO {

    private Integer productOrderId;
    private Integer quantity;
    private Integer productId;
    private Integer orderId;
    private Integer vendingMachineId;
    private List<CondimentOrderDTO> productOrderCondiments;
    private OrderDTO order;
    private ProductTypesEnum name;
}
