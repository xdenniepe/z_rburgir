package com.roboburger.inventory.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.roboburger.inventory.entity.NutritionFacts;


@RepositoryRestResource
public interface NutritionFactsRepository extends JpaRepository<NutritionFacts, Integer> {
    @Query(value = "SELECT "+ 
    "SUM([nf_id]) as nf_id, " +
    "SUM([condiment_id]) as condiment_id, " +
    "SUM([product_id]) as product_id, " +
    "SUM([calories]) as calories, " +
    "SUM([serving]) as serving, " +
    "SUM([trans_fat]) as trans_fat, " +
    "SUM([poly_fat]) as poly_fat, " +
    "SUM([mono_fat]) as mono_fat, " +
    "SUM([total_sugars]) as total_sugars, " +
    "SUM([protein]) as protein, " +
    "SUM([total_fat_grams]) as total_fat_grams, " +
    "SUM([total_fat_percent]) as total_fat_percent, " +
    "SUM([saturated_fat_grams]) as saturated_fat_grams, " +
    "SUM([saturated_fat_percent]) as saturated_fat_percent, " +
    "SUM([cholesterol_grams]) as cholesterol_grams, " +
    "SUM([cholesterol_percent]) as cholesterol_percent, " +
    "SUM([sodium_grams]) as sodium_grams, " +
    "SUM([sodium_percent]) as sodium_percent, " +
    "SUM([total_carbs_grams]) as total_carbs_grams, " +
    "SUM([total_carbs_percent]) as total_carbs_percent, " +
    "SUM([dietary_fiber_grams]) as dietary_fiber_grams, " +
    "SUM([dietary_fiber_percent]) as dietary_fiber_percent, " +
    "SUM([calcium_grams]) as calcium_grams, " +
    "SUM([calcium_percent]) as calcium_percent, " +
    "SUM([potassium_grams]) as potassium_grams, " +
    "SUM([potassium_percent]) as potassium_percent, " +
    "SUM([iron_grams]) as iron_grams, " +
    "SUM([iron_percent]) as iron_percent " +
    "FROM [nutritionFacts] WHERE condiment_id IN (:ids) OR product_id = :productId", nativeQuery = true)
Optional<NutritionFacts> getTotalNf(List<Integer> ids, Integer productId);
}
