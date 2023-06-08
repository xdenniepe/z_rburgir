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
@Table(name = "ingredientMainContent")
public class IngredientMainContent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ingredient_main_content_id")
    private Integer ingredientMainContentId;

    @Column(name = "ingredient_main_id")
    private Integer ingredientMainId;

    @Column(name = "ingredient_content_id")
    private Integer ingredientContentId;
    
}
