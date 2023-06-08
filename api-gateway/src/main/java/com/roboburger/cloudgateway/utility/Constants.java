package com.roboburger.cloudgateway.utility;

import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;

@Component
public class Constants {

  private Constants() {}

  public static String SECRET;

	@Value("${api.secret}")
  	private void setJwtSecret(String jwtSecret) {
		SECRET = jwtSecret;
	}

  public static final String PUBLIC_API       = "/api/public";
  public static final String USER_API         = "/api/users/";
  public static final String FIND_BY_TOKEN    = "/search/findByToken";
  public static final String AUTHORIZATION    = "Authorization";
  public static final String BEARER           = "Bearer ";
  public static final Integer EXPIRATION_TIME = 43200;                  // 30 days in minutes
  public static final String TOKEN_PREFIX     = "Bearer ";
  public static final String HEADER_STRING    = "Authorization";
}
