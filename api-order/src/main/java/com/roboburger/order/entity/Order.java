package com.roboburger.order.entity;

import java.util.List;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.roboburger.core.enumerated.OrderStatusEnum;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "[order]")
public class Order extends AbstractEntity implements IEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "order_id")
	private Integer orderId;

  	@Column(name = "user_id")
	private Integer userId;

	@Column(name = "quantity")
	private Integer quantity;

	@Column(name = "total_cost")
	private Integer totalCost;

	@Enumerated(EnumType.STRING)
	@Column(name = "status", columnDefinition = "varchar(32) default 'PENDING'") 
	private OrderStatusEnum status;

	@JsonIgnore
	@OneToMany(mappedBy = "order", fetch = FetchType.LAZY)
    private List<ProductOrder> productOrders;
	
}
