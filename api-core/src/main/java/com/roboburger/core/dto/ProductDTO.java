package com.roboburger.core.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@ToString
@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ProductDTO {

	private Integer productId;
	private Integer vendingMachineID;
	private String name;
	private Double price;
	private String description;
	private Integer quantity;
	private String info;
	private String image;
	private String status;
	private Integer productTypeId;

}
