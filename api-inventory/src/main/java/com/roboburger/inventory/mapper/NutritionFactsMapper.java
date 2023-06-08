package com.roboburger.inventory.mapper;


import com.roboburger.core.dto.NutritionFactsDTO;
import com.roboburger.core.dto.ProductDTO;
import com.roboburger.inventory.entity.NutritionFacts;
import com.roboburger.inventory.entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper
public interface NutritionFactsMapper {

    NutritionFactsMapper INSTANCE = Mappers.getMapper(NutritionFactsMapper.class);

    NutritionFactsDTO entityToDTO(NutritionFacts entity);
    
}
