package com.roboburger.inventory.repository;

import com.roboburger.inventory.entity.IngredientCondiment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface IngredientCondimentRepository extends JpaRepository<IngredientCondiment, Integer> {
    
    @Query(value = "SELECT a FROM IngredientCondiment a JOIN IngredientCondiment b ON a.ingredientCondimentId = b.ingredientCondimentId WHERE b.ingredientCondimentId IN (:ids)")
    List<IngredientCondiment> findByIds(List<Integer> ids);

}
