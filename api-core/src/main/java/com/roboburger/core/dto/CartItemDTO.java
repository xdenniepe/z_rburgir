package com.roboburger.core.dto;

import java.util.List;
import java.util.UUID;

import com.roboburger.core.enumerated.CartItemStatusEnum;


import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@ToString
@Getter
@Setter
public class CartItemDTO  {

    private UUID 	uuid;
	private Integer productId;
    private Integer orderId;
	private Integer productOrderId;
	private Integer quantity;
	private String  image;
	private String  name;
	private String  description;
	private Integer vendingMachineId;
	private String  vmLocation;
	private String  vmAddress;
	private String  vmCity;
	private Double  price;
	private Double  subtotal;
	private Double  tax;
	private Double  total;
	private Double  condimentPrice;
	private CartItemStatusEnum status;
	private List<CondimentOrderDTO> condimentOrder;

}
