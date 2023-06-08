package com.roboburger.payment.config;

import java.util.Map;

import com.braintreegateway.BraintreeGateway;

public class BraintreeGatewayFactory {

    public static BraintreeGateway fromConfigMapping(Map<String, String> mapping) {
        return new BraintreeGateway(
            mapping.get("BT_ENVIRONMENT"),
            mapping.get("BT_MERCHANT_ID"),
            mapping.get("BT_PUBLIC_KEY"),
            mapping.get("BT_PRIVATE_KEY")
        );
    }

}
