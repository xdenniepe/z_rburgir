package com.roboburger.order.entity.projection;

import com.roboburger.order.entity.ProductOrder;

import org.springframework.data.rest.core.config.Projection;

@Projection(name = "withId", types = { ProductOrder.class }) 
interface ProductOrderProjection { 
    Integer getProductOrderId();
    Integer getQuantity();
    Double  getPrice();
}
