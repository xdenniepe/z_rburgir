package com.roboburger.order.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Bean
    @Qualifier("inventory")
    public WebClient inventoryClient(@Value("${api.inventory}") String endpoint){
        return WebClient.builder()
                .baseUrl(endpoint)
                .build();
    }

    @Bean
    @Qualifier("vendingMachine")
    public WebClient vendingMachineClient(@Value("${api.vendingMachine}") String endpoint){
        return WebClient.builder()
                .baseUrl(endpoint)
                .build();
    }

}