package com.roboburger.cloudgateway.config;

import com.roboburger.cloudgateway.utility.Constants;
import com.roboburger.cloudgateway.utility.JWTUtil;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@RefreshScope
@Component
@Slf4j
public class AuthenticationFilter implements GatewayFilter {

    @Value("${api.auth}")
    private String authAPI;

    @Autowired
    private RouterValidator routerValidator;

    @LoadBalanced
    private final WebClient.Builder webClientBuilder;

    public AuthenticationFilter(WebClient.Builder webClientBuilder) {
        this.webClientBuilder = webClientBuilder;
    }

    /***
     *
     * @param exchange
     * @param chain
     * @return
     */
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();

        if (routerValidator.isSecured.test(request)) {
            final String token = this.getAuthHeader(request);

            log.info("JWT: {}", token);

            if (this.isAuthMissing(request)) {
                return this.onError(exchange, "Authorization header is missing in request", HttpStatus.UNAUTHORIZED);
            }

            if (token != null) {
                boolean isTokenValid = JWTUtil.validateJwtToken(token.substring(7, token.length()));

                if (!isTokenValid) {
                    return this.onError(exchange, "Invalid JWT", HttpStatus.UNAUTHORIZED);
                }

                log.info("Token Valid > Sending token to authorization service...");
                log.info("URI: {}", request.getURI());
                log.info("HTTP Method: {}", request.getMethod());
                log.info("Path: {}", request.getPath());
                log.info("Query Params: {}", request.getQueryParams());
                log.info("Body: {}", request.getBody().getClass());

                if (!this.isAuthorized(token.substring(7, token.length()))) {
                    log.info("this authorized? -- {}", !this.isAuthorized(token.substring(7, token.length())));
                    return this.onError(exchange,
                            "You are not authorize to access this resource.",
                            HttpStatus.FORBIDDEN);
                }

            }

        }

        return chain.filter(exchange);
    }

    /***
     * @param exchange
     * @param err
     * @param httpStatus
     * @return
     */
    private Mono<Void> onError(ServerWebExchange exchange, String err, HttpStatus httpStatus) {
        ServerHttpResponse response = exchange.getResponse();

        response.setStatusCode(httpStatus);
        return response.setComplete();
    }

    /***
     * @param request
     * @return
     */
    private boolean isAuthMissing(ServerHttpRequest request) {
        return !request.getHeaders().containsKey("Authorization");
    }

    /***
     *
     * @param request
     * @return
     */
    private String getAuthHeader(ServerHttpRequest request) {
        return request.getHeaders().getOrEmpty("Authorization").get(0);
    }

    /***
     *
     * @param token
     * @return
     */
    public boolean isInvalid(String token) {
        return JWTUtil.isTokenExpired(token);
    }

    /**
     * 
     * @param token
     * @return
     */
    private boolean isAuthorized(String token) {

        return webClientBuilder.build()
                .get()
                .uri(authAPI + Constants.PUBLIC_API + "/authorization")
                .header(Constants.AUTHORIZATION, Constants.BEARER + token)
                .retrieve()
                .bodyToMono(boolean.class)
                .share().block();
    }
}
