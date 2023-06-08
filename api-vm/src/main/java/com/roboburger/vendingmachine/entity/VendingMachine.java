package com.roboburger.vendingmachine.entity;

import javax.persistence.*;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.Formula;

@Getter
@Setter
@Entity
@ToString
@Table(name = "[units]")
public class VendingMachine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "unitID")
    private Integer vendingMachineId;

    @Column(name = "locationName")
    private String location;

    @Column(name = "locationAddress")
    private String address;

    @Column(name = "locationCity")
    private String city;

    @Column(name = "locationState")
    private String state;

    @Column(name = "locationCountry")
    private String country;

    @Column(name = "locationlatitude")
    private Double latitude;

    @Column(name = "locationlongitude")
    private Double longitude;

    @Column(name = "postal_code")
    private String postalCode;

    @Column(name = "opening_hours")
    private String openingHours;

    @Column(name = "price")
    private Double price;

}

