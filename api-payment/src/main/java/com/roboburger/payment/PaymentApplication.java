package com.roboburger.payment;

import com.braintreegateway.BraintreeGateway;
import com.roboburger.payment.config.BraintreeGatewayFactory;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

import lombok.extern.slf4j.Slf4j;


@SpringBootApplication(exclude={SecurityAutoConfiguration.class})
@Slf4j
public class PaymentApplication {
    public static BraintreeGateway gateway;
	public static void main(String[] args) {
        try {
            gateway = BraintreeGatewayFactory.fromConfigMapping(System.getenv());
            log.info("Braintree initialize...");
        } catch (NullPointerException e) {
            System.err.println("Could not load Braintree configuration from config file or system environment.");
            System.exit(1);
        }

		SpringApplication.run(PaymentApplication.class, args);
	}

}
