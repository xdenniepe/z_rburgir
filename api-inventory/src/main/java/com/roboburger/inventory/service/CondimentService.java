package com.roboburger.inventory.service;

import com.roboburger.inventory.entity.Condiment;
import com.roboburger.inventory.entity.IngredientCondiment;
import com.roboburger.inventory.entity.Product;
import com.roboburger.inventory.mapper.CondimentMapper;
import com.roboburger.inventory.mapper.NutritionFactsMapper;
import com.roboburger.inventory.repository.CondimentRepository;
import com.roboburger.inventory.repository.IngredientCondimentRepository;
import com.roboburger.inventory.repository.NutritionFactsRepository;
import com.roboburger.core.dto.CondimentOrderDTO;
import com.roboburger.core.dto.NutritionFactsDTO;
import com.roboburger.core.dto.CondimentDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;


@Service
public class CondimentService {

    @Autowired
    private CondimentRepository condimentRepository;

    @Autowired
    private ProductService productService;

    @Autowired
    private NutritionFactsRepository nutritionFactsRepository;

    @Autowired
    private IngredientCondimentRepository ingredientCondimentRepository;

    private static final CondimentMapper condimentMapper = CondimentMapper.INSTANCE;
    private static final NutritionFactsMapper nutritionFactsMapper = NutritionFactsMapper.INSTANCE;

    public List<CondimentDTO> getProductOptions() {
        List<Condiment> condiments = condimentRepository.findAll();

        if (condiments.isEmpty()) {
            throw new ResourceNotFoundException("Invalid Vending Machine ID!");
        }

        return condiments.stream().map(condimentMapper::entityToDTO).collect(Collectors.toList());
    }

    public CondimentOrderDTO findByOptionId(Integer optionId) {

        Condiment condiment = condimentRepository.findById(optionId).orElse(null);

        CondimentOrderDTO condimentOrderDTO = new CondimentOrderDTO();
        if (condiment != null) {
            condimentOrderDTO.setName(condiment.getName());
            condimentOrderDTO.setOptionsTypeId(condiment.getOptionsTypeId());
        }

        return condimentOrderDTO;
    }

    public List<IngredientCondiment> getCondiments(Integer productId, List<CondimentDTO> condiments) {

        Product product = productService.findById(productId);

        List<IngredientCondiment> condimentsIngredients;

        if (product.getName().equalsIgnoreCase("standard")) {
            condimentsIngredients = ingredientCondimentRepository.findAll();
        } else {
            List<Integer> condimentIds = condiments.stream().map((c) -> {
                return c.getOptionsTypeId();
            }).collect(Collectors.toList());
    
            condimentsIngredients = ingredientCondimentRepository.findByIds(condimentIds);
        }

        return condimentsIngredients;
    }

    public NutritionFactsDTO getCondimentNF(List<CondimentOrderDTO> condiments, Integer productId) {
        List<Integer> ids = new ArrayList<>();
        
        for(CondimentOrderDTO condiment : condiments) {
            ids.add(condiment.getOptionsTypeId());
        }
        
        return nutritionFactsMapper.entityToDTO(nutritionFactsRepository.getTotalNf(ids, productId).orElse(null));
    }

}
