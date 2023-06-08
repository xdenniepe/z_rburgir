package com.roboburger.inventory.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Getter
@Setter
@Entity
@Table(name = "ingredientCondimentContent")

public class IngredientCondimentContent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ingredient_condiment_content_id")
    private Integer ingredientCondimentContentId;

    @Column(name = "ingredient_condiment_id")
    private Integer ingredientCondimentId;

    @Column(name = "ingredient_content_id")
    private Integer ingredientContentId;

    
}
