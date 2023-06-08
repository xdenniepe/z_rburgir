package com.roboburger.inventory.service;

import java.util.List;
import java.util.stream.Collectors;

import com.roboburger.inventory.entity.IngredientMain;
import com.roboburger.inventory.entity.Product;

import com.roboburger.inventory.mapper.ProductMapper;
import com.roboburger.inventory.repository.IngredientMainRepository;
import com.roboburger.inventory.repository.ProductRepository;
import lombok.extern.log4j.Log4j2;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import com.roboburger.core.dto.ProductDTO;

@Service
@Log4j2
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private IngredientMainRepository ingredientMainRepository;

    private static final ProductMapper productMapper = ProductMapper.INSTANCE;

    public List<ProductDTO> getProducts() {
        List<Product> products  = productRepository.findAll();

        if (products.isEmpty()) {
            throw new ResourceNotFoundException("Invalid Vending Machine ID!");
        }

        return products.stream().map(productMapper::entityToDTO).collect(Collectors.toList());
    }

    public Product findById(Integer productId) {
        return productRepository.findByProductId(productId).orElse(null);
    }

    public List<IngredientMain> getIngredients() {
        return ingredientMainRepository.findAll();
    }

}