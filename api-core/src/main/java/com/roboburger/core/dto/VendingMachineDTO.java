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
public class VendingMachineDTO {

    private Integer id;
    private Integer vendingMachineId;
    private String location;
    private String address;
    private String city;
    private String state;
    private String country;
    private Double latitude;
    private Double longitude;
    private Double price;
    private Double distance;
    private String postalCode;
    private String openingHours;
    private List<String> openings;
}
