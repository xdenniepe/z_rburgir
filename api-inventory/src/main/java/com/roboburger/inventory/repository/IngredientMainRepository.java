package com.roboburger.inventory.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.roboburger.inventory.entity.IngredientMain;

public interface IngredientMainRepository extends JpaRepository<IngredientMain, Integer> {

    @Query("SELECT a FROM IngredientMain a JOIN IngredientMainContent b ON a.ingredientMainId = b.ingredientMainId WHERE b.ingredientMainId = :productId")
    List<IngredientMain> findByProductId(Integer productId);
}
