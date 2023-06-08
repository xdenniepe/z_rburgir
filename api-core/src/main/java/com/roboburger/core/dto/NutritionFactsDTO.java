package com.roboburger.core.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@JsonInclude(JsonInclude.Include.NON_NULL)
public class NutritionFactsDTO {
    private Integer condimentNfId;
    private Integer condimentId;
    private Integer productId;
    private Double calories;
    private Double serving;
    private Double transFat;
    private Double polyFat;
    private Double monoFat;
    private Double totalSugars;
    private Double protein;
    private Double totalFatGrams;
    private Double totalFatPercent;
    private Double saturatedFatGrams;
    private Double saturatedFatPercent;
    private Double cholesterolGrams;
    private Double cholesterolPercent;
    private Double sodiumGrams;
    private Double sodiumPercent;
    private Double totalCarbsGrams;
    private Double totalCarbsPercent;
    private Double dietaryFiberGrams;
    private Double dietaryFiberPercent;
    private Double calciumGrams;
    private Double calciumPercent;
    private Double potassiumGrams;
    private Double potassiumPercent;
    private Double ironGrams;
    private Double ironPercent;
    
}
