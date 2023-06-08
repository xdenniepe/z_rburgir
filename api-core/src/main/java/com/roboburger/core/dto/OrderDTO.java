package com.roboburger.core.dto;

import com.roboburger.core.enumerated.OrderStatusEnum;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderDTO  {

	private Integer orderId;
	private Integer userId;
	private Integer quantity;
	private Integer totalCost;
	private OrderStatusEnum status;
	
}
