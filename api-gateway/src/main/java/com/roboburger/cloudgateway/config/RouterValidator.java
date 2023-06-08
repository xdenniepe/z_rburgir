package com.roboburger.cloudgateway.config;

import java.util.List;
import java.util.function.Predicate;

import com.roboburger.cloudgateway.utility.Constants;

import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

@Component
public class RouterValidator {

    public static final List<String> openApiEndpoints = List.of(
      Constants.PUBLIC_API + "/login",
      Constants.PUBLIC_API + "/register",
      Constants.PUBLIC_API + "/register/**",
      Constants.PUBLIC_API + "/search/findByToken",
      Constants.PUBLIC_API + "/search/findByEmail",
      Constants.PUBLIC_API + "/search/findByPhoneNumber",
      Constants.PUBLIC_API + "/forgotPassword",
      Constants.PUBLIC_API + "/forgotPassword/**",
      Constants.PUBLIC_API + "/newPassword",
      Constants.PUBLIC_API + "/newPassword/**",
      Constants.PUBLIC_API + "/verification",
      Constants.PUBLIC_API + "/users/update/verify",
      Constants.PUBLIC_API + "/unsubscribe/**",
      Constants.PUBLIC_API + "/unsubscribe"
    );

    public Predicate<ServerHttpRequest> isSecured =
        request -> openApiEndpoints
                .stream()
                .noneMatch(uri -> request.getURI().getPath().contains(uri));
}
