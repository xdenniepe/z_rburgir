package com.roboburger.auth.security;

import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;


@Component
public class WebSecurityConstants {

	public static String SECRET;

	@Value("${api.secret}")
  	private void setJwtSecret(String jwtSecret) {
		SECRET = jwtSecret;
	}

	public static final int EXPIRATION_TIME = 43200; // 30 days in minutes
	public static final String TOKEN_PREFIX = "Bearer ";
	public static final String HEADER_STRING = "Authorization";
	public static final String SIGN_UP_URL = "/api/public/register";

}
