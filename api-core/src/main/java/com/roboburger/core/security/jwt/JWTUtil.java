package com.roboburger.core.security.jwt;

import com.roboburger.core.security.WebSecurityConstants;
import com.roboburger.core.security.user.UserCredential;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;

public class JWTUtil {

	public static UserCredential parseToken(String token, String secretKey) {
		try {
			Claims body = Jwts.parser().setSigningKey(secretKey.getBytes()).parseClaimsJws(token).getBody();
			UserCredential userCredential = new UserCredential();
			userCredential.setUsername(body.getSubject());
			userCredential.setUserId((Integer) body.get("id"));

			return userCredential;

		} catch (JwtException | ClassCastException e) {
			e.printStackTrace();
			return null;
		}
	}
}