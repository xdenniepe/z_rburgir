package com.roboburger.order.config;

import com.roboburger.order.config.AuditAware;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@Configuration
@EntityScan("com.roboburger.order.entity")
@EnableJpaAuditing(auditorAwareRef = "auditorAware")
public class JpaConfig {

  @Bean
  public AuditorAware<Integer> auditorAware() {
    return new AuditAware();
  }
}