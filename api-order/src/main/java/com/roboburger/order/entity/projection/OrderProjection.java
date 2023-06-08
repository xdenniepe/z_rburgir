package com.roboburger.order.entity.projection;

import com.roboburger.order.entity.Order;

import org.springframework.data.rest.core.config.Projection;

@Projection(name = "withId", types = { Order.class }) 
interface OrderProjection { 

    Integer getOrderId();
    Integer getUserId();
    Integer getQuantity();
    Integer getTotalCost();
    
}