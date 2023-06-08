package com.roboburger.inventory.controller;

import com.roboburger.inventory.entity.IngredientCondiment;
import com.roboburger.inventory.service.CondimentService;
import com.roboburger.core.dto.CondimentOrderDTO;
import com.roboburger.core.dto.NutritionFactsDTO;
import com.roboburger.core.dto.CondimentDTO;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.transaction.Transactional;
import java.util.List;

@RestController
@RepositoryRestController
@Log4j2
public class CondimentController {

    @Autowired
    private CondimentService optionService;

    @GetMapping("api/condiments")
    @Transactional
    public ResponseEntity<List<CondimentDTO>> purchase() {
        List<CondimentDTO> productList = optionService.getProductOptions();
        return new ResponseEntity<>(productList, HttpStatus.OK);
    }

    @GetMapping("api/condiments/findById")
    @Transactional
    public ResponseEntity<CondimentOrderDTO> getCondimentsById(@RequestParam("optionId") Integer optionId) {
        CondimentOrderDTO condiment = optionService.findByOptionId(optionId);
        return new ResponseEntity<>(condiment, HttpStatus.OK);
    }

    @PostMapping("/api/condiments/ingredients")
    public ResponseEntity<List<IngredientCondiment>> getCondiments(@RequestParam("productId") Integer productId, @RequestBody List<CondimentDTO> condiments) {

        return ResponseEntity.ok(optionService.getCondiments(productId, condiments));
    }

    @PostMapping("/api/condiments/condimentnf")
    public ResponseEntity<NutritionFactsDTO> getCondimentNF(@RequestBody List<CondimentOrderDTO> condiments, @RequestParam("productId") Integer productId) {

        return ResponseEntity.ok(optionService.getCondimentNF(condiments, productId));
    }

}
