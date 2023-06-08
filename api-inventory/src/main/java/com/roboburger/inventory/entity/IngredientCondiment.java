package com.roboburger.inventory.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import java.util.List;

import javax.persistence.*;

@Getter
@Setter
@Entity
@Table(name = "ingredientCondiment")
public class IngredientCondiment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ingredient_condiment_id")
    private Integer ingredientCondimentId;

    @Column(name = "name")
    private String name;
    
    @ManyToMany
    @JoinTable(
    name = "ingredientCondimentContent", 
    joinColumns = @JoinColumn(name = "ingredient_condiment_id"), 
    inverseJoinColumns = @JoinColumn(name = "ingredient_content_id"))
    List<IngredientContent> condimentIngredients;
}
