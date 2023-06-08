package com.roboburger.inventory.entity;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Getter
@Setter
@Entity
@Table(name = "ingredientContent")
public class IngredientContent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ingredient_content_id")
    private Integer ingredientContentId;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @JsonIgnore
    @ManyToMany(mappedBy = "condimentIngredients")
    List<IngredientCondiment> condiment;

    @JsonIgnore
    @ManyToMany(mappedBy = "mainIngredients")
    List<IngredientMain> mainIngredient;
    
}
