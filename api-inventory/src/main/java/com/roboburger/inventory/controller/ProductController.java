package com.roboburger.inventory.controller;

import java.util.List;

import com.roboburger.inventory.entity.IngredientMain;
import com.roboburger.inventory.mapper.ProductMapper;
import com.roboburger.inventory.service.ProductService;
import com.roboburger.core.dto.ProductDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RepositoryRestController
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping("/api/products")
    public ResponseEntity<List<ProductDTO>> purchase() {
        List<ProductDTO> productList = productService.getProducts();
        return new ResponseEntity<>(productList, HttpStatus.OK);
    }

    @GetMapping("/api/products/findById")
    public ProductDTO findById(@RequestParam("productId") Integer productId) {
        ProductDTO product = ProductMapper.INSTANCE.entityToDTO(productService.findById(productId));
        return product;
    }

    @GetMapping("/api/products/ingredients/main")
    public ResponseEntity<List<IngredientMain>> getMainIngredients() {
        return ResponseEntity.ok(productService.getIngredients());
    }

}