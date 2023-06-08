package com.roboburger.payment.service;

import java.util.List;
import java.util.Optional;
import java.util.function.Predicate;

import com.roboburger.core.dto.ProductDTO;

import org.springframework.stereotype.Service;

@Service
public class ProductService {
    
    public Optional<ProductDTO> getProduct(List<ProductDTO> products, Integer productId) { 
        return products.stream().filter(matchesProductId(productId)).findFirst();
    }

    public Predicate<ProductDTO> matchesProductId(Integer productId) {
        return item -> item.getProductId().equals(productId);
    }
}
