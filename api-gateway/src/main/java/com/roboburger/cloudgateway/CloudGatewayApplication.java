package com.roboburger.cloudgateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.core.SpringVersion;
@SpringBootApplication
public class CloudGatewayApplication {
  
	public static void main(String[] args) {
        System.out.println("version: " + SpringVersion.getVersion());
		SpringApplication.run(CloudGatewayApplication.class, args);
	}

}
