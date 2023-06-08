package com.roboburger.cloudgateway.utility;

import java.util.Date;
import java.util.Map;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.Claim;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.roboburger.core.security.user.UserCredential;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class JWTUtil {
  
  private JWTUtil() {}

  /***
   *
   * @param token
   * @return
   */
  public static Claims getAllClaimsFromToken(String token) {
    return Jwts.parser()
          .setSigningKey(Constants.SECRET.getBytes())
          .parseClaimsJws(token.substring(7, token.length()))
          .getBody();
  }

  /***
   *
   * @param token
   * @return
   */
  public static boolean isTokenExpired(String token) {
    return getAllClaimsFromToken(token).getExpiration().before(new Date());
  }

  /***
   *
   * @param token
   * @return
   */
  public static boolean validateJwtToken(String token) {
    try {
      log.info("VALIDATE TOKEEEN : {}", token);
      Algorithm algorithm = Algorithm.HMAC512(Constants.SECRET.getBytes());
      JWTVerifier verifier = JWT.require(algorithm).build();
      DecodedJWT jwt = verifier.verify(token);
      Map<String, Claim> claims = jwt.getClaims();

      for (Map.Entry<String, Claim> entry : claims.entrySet()) {
        log.info("get keyyyy {}:{}", entry.getKey(), entry.getValue());
      }

      return true;
    } catch (JWTVerificationException ex) {
      ex.printStackTrace();
    }

    return false;
  }

}
