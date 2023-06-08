package com.roboburger.inventory.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "[nutritionFacts]")
public class NutritionFacts {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "nf_id")
    private Integer condimentNfId;

    @Column(name = "condiment_id")
    private Integer condimentId;
    
    @Column(name = "product_id")
    private Integer productId;

    @Column(name = "calories")
    private Double calories;

    @Column(name = "serving")
    private Double serving;

    @Column(name = "trans_fat")
    private Double transFat;

    @Column(name = "poly_fat")
    private Double polyFat;

    @Column(name = "mono_fat")
    private Double monoFat;

    @Column(name = "total_sugars")
    private Double totalSugars;

    @Column(name = "protein")
    private Double protein;
    
    @Column(name = "total_fat_grams")
    private Double totalFatGrams;

    @Column(name = "total_fat_percent")
    private Double totalFatPercent;

    @Column(name = "saturated_fat_grams")
    private Double saturatedFatGrams;

    @Column(name = "saturated_fat_percent")
    private Double saturatedFatPercent;

    @Column(name = "cholesterol_grams")
    private Double cholesterolGrams;

    @Column(name = "cholesterol_percent")
    private Double cholesterolPercent;

    @Column(name = "sodium_grams")
    private Double sodiumGrams;

    @Column(name = "sodium_percent")
    private Double sodiumPercent;

    @Column(name = "total_carbs_grams")
    private Double totalCarbsGrams;

    @Column(name = "total_carbs_percent")
    private Double totalCarbsPercent;

    @Column(name = "dietary_fiber_grams")
    private Double dietaryFiberGrams;

    @Column(name = "dietary_fiber_percent")
    private Double dietaryFiberPercent;

    @Column(name = "calcium_grams")
    private Double calciumGrams;
    
    @Column(name = "calcium_percent")
    private Double calciumPercent;

    @Column(name = "potassium_grams")
    private Double potassiumGrams;
    
    @Column(name = "potassium_percent")
    private Double potassiumPercent;

    @Column(name = "iron_grams")
    private Double ironGrams;
    
    @Column(name = "iron_percent")
    private Double ironPercent;
    
}
