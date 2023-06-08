package com.roboburger.inventory.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@Entity
@ToString
@Table(name = "[condimentTypes]")
public class Condiment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "condimentTypeID")
    private Integer optionsTypeId;

    @Column(name = "name")
    private String name;

}
