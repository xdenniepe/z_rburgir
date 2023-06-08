package com.roboburger.payment.apiservice;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.roboburger.core.dto.CartItemDTO;
import com.roboburger.core.dto.OrderDTO;
import com.roboburger.core.enumerated.OrderStatusEnum;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class OrderApiService {
    
    @Autowired
    @Qualifier("order")
    private WebClient orderClient;

    public List<CartItemDTO> getCartItems(String token, int userId) {
        return orderClient.get().uri(uriBuilder -> uriBuilder.path("/api/cart/items")
                                                             .queryParam("userId", userId).build())
                                .header(HttpHeaders.AUTHORIZATION, token)
                                .retrieve()
                                .bodyToMono(new ParameterizedTypeReference<List<CartItemDTO>>() {})
                                .block();

    }

    public List<CartItemDTO> findByOrderId(Integer orderId) {
        return orderClient.get().uri(uriBuilder -> uriBuilder.path("/api/cart/items/findByOrderId")
                        .queryParam("orderId", orderId).build())
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<CartItemDTO>>() {})
                .block();

    }

    public OrderDTO updateOrder(String token, int orderId) {
        Map<String, String> payload = new HashMap<>();
        payload.put("status", OrderStatusEnum.COMPLETED.name());

        return orderClient.patch().uri(uriBuilder -> uriBuilder.path("/api/orders/{orderId}").build(orderId))
                                  .contentType(MediaType.APPLICATION_JSON)
                                  .body(BodyInserters.fromValue(payload))
                                  .header(HttpHeaders.AUTHORIZATION, token)
                                  .retrieve()
                                  .bodyToMono(OrderDTO.class)
                                  .block();                    
    }
}
