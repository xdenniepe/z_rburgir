package com.roboburger.order.apiservice;

import java.util.List;

import com.roboburger.core.dto.CondimentOrderDTO;
import com.roboburger.core.dto.ProductDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class ProductApiService {

    @Autowired
    @Qualifier("inventory")
    WebClient productClient;

    public List<ProductDTO> getProducts() {
        return  productClient.get().uri(uriBuilder -> uriBuilder.path("/api/products")
                .build())
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<ProductDTO>>() {})
                .block();
    }

    public ProductDTO getProductsById(Integer productId) {
        return  productClient.get().uri(uriBuilder -> uriBuilder.path("/api/products/findById")
                .queryParam("productId", productId)
                .build())
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<ProductDTO>() {})
                .block();
    }

    public CondimentOrderDTO getCondimentsById(Integer optionId) {
        return  productClient.get().uri(uriBuilder -> uriBuilder.path("/api/condiments/findById")
                .queryParam("optionId", optionId)
                .build())
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<CondimentOrderDTO>() {})
                .block();
    }

}
