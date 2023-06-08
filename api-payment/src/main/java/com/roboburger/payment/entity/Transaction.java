package com.roboburger.payment.entity;

import java.util.List;

import javax.persistence.*;

import com.roboburger.core.utility.Utility;

import lombok.ToString;
import org.hibernate.annotations.Formula;

import lombok.Getter;
import lombok.Setter;
@ToString
@Getter
@Setter
@Entity
@Table(name = "[transaction]")
public class Transaction extends AbstractEntity implements IEntity {

  	@Id
  	@GeneratedValue(strategy = GenerationType.IDENTITY)
  	@Column(name = "transaction_id")
  	private Integer transactionId;

	@Column(name = "order_id", unique=true)
	private Integer orderId;

	@Column(name = "coupon_id", nullable = true)
	private Integer couponId;

	@Column(name = "user_id")
	private Integer userId;

	@Column(name = "total")
	private Double totalCost;

	@Formula("(SELECT SUM(ti.item_price) FROM transaction_item ti WHERE ti.transaction_id = transaction_id)")
	private Double subtotal;

	public Double getFees() {
		return Utility.formatDouble((subtotal * .10), 2);
	}

	public Double getTotal() {
		return Utility.formatDouble(subtotal + (subtotal * .10), 2);
	}

	@OneToOne(mappedBy = "transaction")
    private Payment payment;

	@OneToMany(mappedBy = "transaction")
    private List<TransactionItem> transactionItems;
}
