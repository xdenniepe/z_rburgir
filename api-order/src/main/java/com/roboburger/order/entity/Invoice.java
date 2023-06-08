package com.roboburger.order.entity;

import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

import org.hibernate.annotations.Immutable;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Immutable
public class Invoice  {
    
    @Id
    @Column(name = "uuid")
    private UUID uuid;

  	@Column(name = "product_id")
	private Integer productId;

    @Column(name = "order_id")
    private Integer orderId;

	@Column(name = "product_order_id")
	private Integer productOrderId;

	@Column(name = "image")
	private String image;

	@Column(name = "name")
	private String description;

	@Column(name = "quantity")
	private Integer quantity;

	@Column(name = "price")
	private Double price;

	@Column(name = "subtotal")
	private Double subtotal;

	@Column(name = "tax")
	private Double tax;

	@Column(name = "total")
	private Double total;

}
