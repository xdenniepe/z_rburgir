package com.roboburger.payment.entity;

import javax.persistence.*;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.Formula;

import com.fasterxml.jackson.annotation.JsonIgnore;

@ToString
@Getter
@Setter
@Entity
@Table(name = "transaction_item")
public class TransactionItem extends AbstractEntity implements IEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "transaction_item_id")
    private Integer transactionItemId;

    @Column(name = "product_id")
    private Integer productId;

    @Column(name = "code", nullable = false)
    private String code;
    
    @Column(name = "item_description")
    private String itemDescription;

    @Column(name = "item_price")
    private Double itemPrice;

    @Column(name = "item_tax")
    private Double itemTax;

    @Column(name = "item_total_cost")
    private Double itemTotalCost;

    @JsonIgnore
    @ManyToOne()
    @JoinColumn(name="transaction_id")
    private Transaction transaction;

}
