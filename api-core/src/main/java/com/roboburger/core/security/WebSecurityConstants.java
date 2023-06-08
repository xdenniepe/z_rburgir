package com.roboburger.core.security;

public class WebSecurityConstants {

	public static final String TOKEN_PREFIX = "Bearer ";
	public static final String HEADER_STRING = "Authorization";
	private WebSecurityConstants() {
		throw new IllegalStateException("Utility class");
	}
	
}
