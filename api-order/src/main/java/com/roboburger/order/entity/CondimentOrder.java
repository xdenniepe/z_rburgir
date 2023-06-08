package com.roboburger.order.entity;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@ToString
@Getter
@Setter
@Entity
@Table(name = "[product_order_options]")
public class CondimentOrder extends AbstractEntity implements IEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "po_options_id")
    private Integer productOrderOptionId;

    @Column(name = "options_id")
    private Integer optionsTypeId;

    @JsonIgnore
    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "product_order_id")
    private ProductOrder productOrder;

}
