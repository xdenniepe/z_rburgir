package com.roboburger.payment.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Bean
    @Qualifier("order")
    public WebClient orderClient(@Value("${api.order}") String endpoint){
        return WebClient.builder()
                .baseUrl(endpoint)
                .build();
    }

    @Bean
    @Qualifier("payment")
    public WebClient paymentClient(@Value("${api.payment}") String endpoint){
        return WebClient.builder()
                .baseUrl(endpoint)
                .build();
    }

    @Bean
    @Qualifier("inventory")
    public WebClient inventoryClient(@Value("${api.inventory}") String endpoint){
        return WebClient.builder()
        .baseUrl(endpoint)
        .build();
    }

    @Bean
    @Qualifier("auth")
    public WebClient userClient(@Value("${api.auth}") String endpoint){
        return WebClient.builder()
                .baseUrl(endpoint)
                .build();
    }

    @Bean
    @Qualifier("vendingMachine")
    public WebClient vmClient(@Value("${api.vendingMachine}") String endpoint){
        return WebClient.builder()
                .baseUrl(endpoint)
                .build();
    }
    

}