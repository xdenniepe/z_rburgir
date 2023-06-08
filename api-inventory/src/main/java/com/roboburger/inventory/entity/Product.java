package com.roboburger.inventory.entity;

import javax.persistence.*;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@ToString
@Getter
@Setter
@Entity
@Table(name = "[burgerType]")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "burgerTypeID")
    private Integer productId;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

}
