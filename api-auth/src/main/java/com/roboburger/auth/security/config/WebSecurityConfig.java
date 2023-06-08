package com.roboburger.auth.security.config;

import java.util.Arrays;

import com.roboburger.auth.repository.UserRepository;
import com.roboburger.auth.security.WebSecurityConstants;
import com.roboburger.auth.security.jwt.JWTAuthenticationFilter;
import com.roboburger.auth.security.user.UserDetailService;
import com.roboburger.auth.security.jwt.JWTAuthorizationFilter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

  @Autowired
  UserRepository userRepository;

	@Value("${cors.allowedOrigins}")
	private String allowedOrigins;

	private UserDetailService userDetailService;
	private BCryptPasswordEncoder bCryptPasswordEncoder;

  public WebSecurityConfig(UserDetailService userService, BCryptPasswordEncoder bCryptPasswordEncoder) {
		this.userDetailService = userService;
		this.bCryptPasswordEncoder = bCryptPasswordEncoder;
	}

  @Override
  protected void configure(HttpSecurity http) throws Exception {
    http
      .cors()
			.and()
			.authorizeRequests()
			.antMatchers(HttpMethod.POST, WebSecurityConstants.SIGN_UP_URL).permitAll()
			.antMatchers("/api/v*/public/**").permitAll()
      .antMatchers("/api/v*/**").authenticated()
			.and()
			.addFilter(new JWTAuthenticationFilter(authenticationManager(), userRepository))
			.addFilter(new JWTAuthorizationFilter(authenticationManager()))
			// this disables session creation on Spring Security
			.sessionManagement()
			.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
      .and()
			.csrf().disable();
  }

  @Override
	public void configure(AuthenticationManagerBuilder auth) throws Exception {
		auth.authenticationProvider(daoAuthenticationProvider());
	}

  @Bean
  public DaoAuthenticationProvider daoAuthenticationProvider() {
    DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
    provider.setPasswordEncoder(bCryptPasswordEncoder);
    provider.setUserDetailsService(userDetailService);
    return provider;
  }

	@Bean
	CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();
		configuration.setAllowedOrigins(Arrays.asList(allowedOrigins.split(",")));
		configuration.setAllowedMethods(Arrays.asList("*"));
		configuration.setAllowedHeaders(Arrays.asList("*"));
		configuration.setAllowCredentials(true);
		configuration.addAllowedHeader("Content-Type");
		configuration.addAllowedHeader("*");
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		return source;
	}
}
