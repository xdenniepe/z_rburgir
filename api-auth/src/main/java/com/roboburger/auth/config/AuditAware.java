package com.roboburger.auth.config;

import java.util.Optional;

import javax.servlet.http.HttpServletRequest;

import com.roboburger.core.security.jwt.JWTUtil;
import com.roboburger.core.security.user.UserCredential;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.AuditorAware;

import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;


@Component
public class AuditAware implements AuditorAware<Integer> {
    
    @Autowired
    private HttpServletRequest request;

    public static String SECRET;

	@Value("${api.secret}")
  	private void setJwtSecret(String jwtSecret) {
		SECRET = jwtSecret;
	}

    @Override
    public Optional<Integer> getCurrentAuditor() {
        String bearerToken = request.getHeader("Authorization");

        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            UserCredential user = JWTUtil.parseToken(bearerToken.substring(7), SECRET);
            if (user != null) {
                return Optional.of(user.getUserId());
            }
        }

        return Optional.empty();
    }

}