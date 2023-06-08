package com.roboburger.inventory.entity;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinTable;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.Table;

@Getter
@Setter
@Entity
@Table(name = "ingredientMain")
public class IngredientMain {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ingredient_main_id")
    private Integer ingredientMainId;

    @Column(name = "name")
    private String name; 

    @ManyToMany
    @JoinTable(
    name = "ingredientMainContent", 
    joinColumns = @JoinColumn(name = "ingredient_main_id"), 
    inverseJoinColumns = @JoinColumn(name = "ingredient_content_id"))
    List<IngredientContent> mainIngredients;
    
}
