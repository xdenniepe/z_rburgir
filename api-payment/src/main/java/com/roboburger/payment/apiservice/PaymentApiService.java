package com.roboburger.payment.apiservice;

import com.roboburger.core.dto.PaymentDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class PaymentApiService {
    
    @Autowired
    @Qualifier("payment")
    private WebClient paymentClient;

    public PaymentDTO createOrder(String token, Double amount, String paymentMethod) {
        return paymentClient.post().uri(uriBuilder -> uriBuilder.path("/api/braintree/checkouts")
                                                                .queryParam("amount", amount)
                                                                .queryParam("payment_method_nonce", paymentMethod).build())
                                   .header(HttpHeaders.AUTHORIZATION, token)
                                   .retrieve()
                                   .bodyToMono(PaymentDTO.class)
                                   .block();                    
    }
}
