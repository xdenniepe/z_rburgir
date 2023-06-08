package com.roboburger.order.event;

import com.roboburger.core.enumerated.OrderStatusEnum;
import com.roboburger.order.entity.Order;

import org.springframework.data.rest.core.annotation.HandleBeforeCreate;
import org.springframework.data.rest.core.annotation.RepositoryEventHandler;



@RepositoryEventHandler(Order.class) 
public class OrderEventHandler {

    @HandleBeforeCreate
    public void handleProductOrderAfterCreate(Order order){
        order.setStatus(OrderStatusEnum.PENDING);
    }
}
