package com.roboburger.payment.config;

import com.roboburger.payment.config.AuditAware;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@Configuration
@EntityScan("com.roboburger.payment.entity")
@EnableJpaAuditing(auditorAwareRef = "auditorAware")
public class JpaConfig {

  @Bean
  public AuditorAware<Integer> auditorAware() {
    return new AuditAware();
  }
}