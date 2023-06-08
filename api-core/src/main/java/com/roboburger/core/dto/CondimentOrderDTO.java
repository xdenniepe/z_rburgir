package com.roboburger.core.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CondimentOrderDTO {
    
    private Integer productOrderOptionId;
	private Integer productOrderId;
	private Integer optionsTypeId;
	private String name;
}
