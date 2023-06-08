package com.roboburger.order.entity.projection;

import com.roboburger.order.entity.Invoice;

import org.springframework.data.rest.core.config.Projection;

@Projection(name = "withId", types = { Invoice.class }) 
interface InvoiceProjection { 

	Integer getProductId();
	Integer getOrderId();
	Integer getProductOrderId();
	String getImage();
	String getDescription();
	Integer getQuantity();
	Double getPrice();
	Double getSubtotal();
	Double getTax();
	Double getTotal();
    
}