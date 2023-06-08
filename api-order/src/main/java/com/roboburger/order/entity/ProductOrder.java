package com.roboburger.order.entity;

import java.util.List;

import javax.persistence.*;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "[product_order]")
public class ProductOrder extends AbstractEntity implements IEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "product_order_id")
  private Integer productOrderId;

  @Column(name = "quantity")
  private Integer quantity;

  @Column(name = "product_id", columnDefinition = "NOT NULL")
  private Integer productId;

  @Column(name = "vending_machine_id")
  private Integer vendingMachineId;

  @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY , mappedBy = "productOrder")
  private List<CondimentOrder> productOrderCondiments;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name="order_id")
  private Order order;
  
}
