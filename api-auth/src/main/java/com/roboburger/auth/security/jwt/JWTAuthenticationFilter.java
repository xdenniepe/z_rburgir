package com.roboburger.auth.security.jwt;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.Optional;

import javax.servlet.FilterChain;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.roboburger.auth.entity.User;
import com.roboburger.auth.repository.UserRepository;
import com.roboburger.auth.security.WebSecurityConstants;
import com.roboburger.core.security.user.UserCredential;

import org.apache.logging.log4j.message.ReusableMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class JWTAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

	private UserRepository userRepository;
	private AuthenticationManager authenticationManager;

	public JWTAuthenticationFilter(AuthenticationManager authenticationManager, UserRepository userRepository) {
		this.authenticationManager = authenticationManager;
		this.userRepository= userRepository;
		setFilterProcessesUrl("/api/public/login");
	}

	@Override
	public Authentication attemptAuthentication(HttpServletRequest req, HttpServletResponse res) throws AuthenticationException {
		try {
			UserCredential credentials = new ObjectMapper().readValue(req.getInputStream(), UserCredential.class);

			User user;
			if ("email".equals(credentials.getLoginType())) {
				user = userRepository.findActiveEmail(credentials.getUsername()).orElse(null);
			} else {
				user = userRepository.findActivePhoneNumber(credentials.getUsername()).orElse(null);
			}
			
			log.info("user: {}", user);

			Authentication auth = authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(credentials.getUsername(), credentials.getPassword(), new ArrayList<>()));

			try {

				if (("ACT".equals(user.getStatus()) || "EXT".equals(user.getStatus())) && user != null) {
					if (auth.isAuthenticated()) {
						log.info("Account   : {}  authentication successful. ", credentials.getUsername());
					} else {
						log.info("Username  : {} Password: {}", credentials.getUsername(), credentials.getPassword());
						log.info("Account   : {}  authentication failed. Invalid credentials ", credentials.getUsername());
					}
		
					return auth;
				} else if ("INA".equals(user.getStatus())) {
					log.info("Account   : {} is still inactive. ", credentials.getUsername());
					
					return null;
				} 

			} catch (NullPointerException e) {
				System.err.println("NullPointerException caught!");
				e.printStackTrace();
			}

		} catch (Exception e) {
      		log.error("Error : {}", e.toString());
		}
		return null;
	}

	@Override
	protected void successfulAuthentication(HttpServletRequest req, HttpServletResponse res, FilterChain chain,
			Authentication auth) throws IOException {

		Calendar c 	= Calendar.getInstance();
		Date now 		= c.getTime();
				
		c.add(Calendar.MINUTE, WebSecurityConstants.EXPIRATION_TIME);
		Date expirationDate = c.getTime();
		String username = ((UserDetails) auth.getPrincipal()).getUsername();
		User user = userRepository.findActiveEmail(username).orElse(null);
		
		if (user == null) {
			log.info("here fail");
			user = userRepository.findActivePhoneNumber(username).get();
		}

		String token 		= JWT.create()
                      .withClaim("id", user.getUserId())
                      .withSubject(username)
			                .withIssuedAt(now)
                      .withNotBefore(now)
                      .withExpiresAt(expirationDate)
			                .sign(Algorithm.HMAC512(WebSecurityConstants.SECRET.getBytes()));

		res.getWriter().write(token);
		res.getWriter().flush();
	}

}
