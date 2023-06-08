package com.roboburger.payment.dto;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class InvoiceDTO  {
    
    private UUID uuid;
	private Integer productId;
    private Integer orderId;
	private Integer productOrderId;
	private String image;
	private String description;
	private Integer quantity;
	private Double price;
	private Double subtotal;
	private Double tax;
	private Double total;

}
