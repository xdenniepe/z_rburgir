package com.roboburger.cloudgateway.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.event.RefreshRoutesResultEvent;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.cloud.gateway.route.CachingRouteLocator;
import org.springframework.cloud.gateway.route.Route;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.context.ApplicationListener;

import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Flux;

@Configuration
@Slf4j
public class GatewayConfig {

    @Autowired
    AuthenticationFilter filter;

    @Value("${api.auth}")
    private String authAPI;

    @Value("${api.inventory}")
    private String inventoryAPI;

    @Value("${api.order}")
    private String orderAPI;

    @Value("${api.vendingMachine}")
    private String vmAPI;

    @Value("${api.payment}")
    private String paymentAPI;

    @Bean
    ApplicationListener<RefreshRoutesResultEvent> routesRefreshed() {
        return rre -> {
            log.info("routes updated");
            var crl = (CachingRouteLocator) rre.getSource();
            Flux<Route> routes = crl.getRoutes();
            routes.subscribe(System.out::println);
        };
    }

    @Bean
    public RouteLocator gatewayRoutes(RouteLocatorBuilder builder) {
        return builder
                .routes()
                .route(route -> route
                        .path("/api/users/**")
                        .or()
                        .path("/api/users")
                        .or()
                        .path("/api/public/**")
                        .and()
                        .method(HttpMethod.GET, HttpMethod.PATCH, HttpMethod.POST, HttpMethod.PUT)
                        .filters(f -> f.filter(filter))
                        .uri(authAPI))
                .route(route -> route
                        .path("/api/orders/**")
                        .or()
                        .path("/api/orders")
                        .or()
                        .path("/api/productOrders/**")
                        .or()
                        .path("/api/productOrders")
                        .or()
                        .path("/api/productOrder/**")
                        .or()
                        .path("/api/productOrder")
                        .or()
                        .path("/api/cart/items")
                        .or()
                        .path("/api/cart/items/**")
                        .and()
                        .method(HttpMethod.GET, HttpMethod.PATCH, HttpMethod.POST, HttpMethod.PUT, HttpMethod.DELETE)
                        .filters(f -> f.filter(filter))
                        .uri(orderAPI))
                .route(route -> route
                        .path("/api/inventory/**")
                        .or()
                        .path("/api/products/**")
                        .or()
                        .path("/api/products")
                        .or()
                        .path("/api/condiments")
                        .or()
                        .path("/api/condiments/**")
                        .or()
                        .path("/api/coupons")
                        .or()
                        .path("/api/coupons/**")
                        .and()
                        .method(HttpMethod.GET, HttpMethod.POST)
                        .filters(f -> f.filter(filter))
                        .uri(inventoryAPI))
                .route(route -> route
                        .path("/api/vendingMachine/**")
                        .or()
                        .path("/api/vendingMachine")
                        .and()
                        .method(HttpMethod.GET)
                        .filters(f -> f.filter(filter))
                        .uri(vmAPI))
                .route(route -> route
                        .path("/api/transactions/**")
                        .or()
                        .path("/api/transactions")
                        .and()
                        .method(HttpMethod.GET, HttpMethod.POST)
                        .filters(f -> f.filter(filter))
                        .uri(paymentAPI))
                .build();
    }
}
