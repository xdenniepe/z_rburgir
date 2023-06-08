package com.roboburger.payment.apiservice;

import java.util.List;

import com.roboburger.core.dto.CouponDTO;
import com.roboburger.core.dto.ProductDTO;
import com.roboburger.core.dto.TransactionItemDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;


@Service
public class InventoryApiService {

    @Autowired
    @Qualifier("inventory")
    private WebClient inventoryClient;

   public List<ProductDTO> getProducts(Integer vendingMachineId) {
       return  inventoryClient.get().uri(uriBuilder -> uriBuilder.path("/api/products")
                                                                 .queryParam("id", vendingMachineId).build())
                                    .retrieve()
                                    .bodyToMono(new ParameterizedTypeReference<List<ProductDTO>>() {})
                                    .block();      
   }

   public List<CouponDTO> getCoupons(List<String> couponCodes, String token) {
        return inventoryClient.post().uri(uriBuilder -> uriBuilder.path("/api/coupons/findCoupons").build(couponCodes))
            .contentType(MediaType.APPLICATION_JSON)
            .body(BodyInserters.fromValue(couponCodes))
            .header(HttpHeaders.AUTHORIZATION, token)
            .retrieve()
            .bodyToMono(new ParameterizedTypeReference<List<CouponDTO>>() {})
            .block();  
    }


    public CouponDTO getCoupon(String code) {
        return  inventoryClient.get().uri(uriBuilder -> uriBuilder.path("/api/coupons")
                        .queryParam("code", code).build())
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<CouponDTO>() {})
                .block();
    }


    public CouponDTO getCouponById(Integer couponId) {
        return  inventoryClient.get().uri(uriBuilder -> uriBuilder.path("/api/coupons/findById")
                        .queryParam("couponId", couponId).build())
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<CouponDTO>() {})
                .block();
    }

    public ProductDTO findProductById(Integer productId) {
       return inventoryClient.get().uri(uriBuilder -> uriBuilder.path("/api/products/findById")
               .queryParam("productId", productId).build())
               .retrieve()
               .bodyToMono(new ParameterizedTypeReference<ProductDTO>() {})
               .block();
    }

    public List<CouponDTO> savePromoCodes(List<TransactionItemDTO> transactionItems, String token) {
        return inventoryClient.post().uri(uriBuilder -> uriBuilder.path("/api/coupons/addCoupon").build(transactionItems))
            .contentType(MediaType.APPLICATION_JSON)
            .body(BodyInserters.fromValue(transactionItems))
            .header(HttpHeaders.AUTHORIZATION, token)
            .retrieve()
            .bodyToMono(new ParameterizedTypeReference<List<CouponDTO>>() {})
            .block();  
    }
    
}
