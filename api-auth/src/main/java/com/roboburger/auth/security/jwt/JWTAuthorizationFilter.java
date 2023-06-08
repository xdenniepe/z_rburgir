package com.roboburger.auth.security.jwt;

import java.io.IOException;
import java.util.ArrayList;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.roboburger.auth.security.WebSecurityConstants;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class JWTAuthorizationFilter extends BasicAuthenticationFilter {

	public JWTAuthorizationFilter(AuthenticationManager authManager) {
		super(authManager);
	}

	@Override
	protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
			throws IOException, ServletException {
		String header = req.getHeader(WebSecurityConstants.HEADER_STRING);
		log.info("header: {}", header);
		if (header == null || !header.startsWith(WebSecurityConstants.TOKEN_PREFIX)) {
			chain.doFilter(req, res);
		} else {
			UsernamePasswordAuthenticationToken authentication = getAuthentication(req);
			SecurityContextHolder.getContext().setAuthentication(authentication);
			chain.doFilter(req, res);
		}
	}

	private UsernamePasswordAuthenticationToken getAuthentication(HttpServletRequest request) {
		String token = request.getHeader(WebSecurityConstants.HEADER_STRING);
		log.info("token: {}", token);

		if (token != null) {
			token = token.replace(WebSecurityConstants.TOKEN_PREFIX, "");
			String user = JWT.require(Algorithm.HMAC512(WebSecurityConstants.SECRET.getBytes())).build()
						.verify(token).getSubject();

			if (user != null) {
				return new UsernamePasswordAuthenticationToken(user, null, new ArrayList<>());
			}

			return null;
		}

		return null;
	}
}
