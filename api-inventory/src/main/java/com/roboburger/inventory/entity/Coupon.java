package com.roboburger.inventory.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.persistence.Table;

import java.sql.Timestamp;
import java.util.Calendar;
import java.util.Date;

@Getter
@Setter
@Entity
@Table(name = "couponCodes")
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "couponId")
    private Integer couponId;

    @Column(name = "couponCreatedAd")
    private Timestamp couponCreatedAt;

    @Column(name = "couponExpiresAt")
    private Timestamp couponExpiresAt;

    @Column(name = "couponCode")
    private String couponCode;

    @Column(name = "discountPct")
    private Integer discountPercentage;

    @Column(name = "is_multiUse")
    private Integer multiUse;

    @PrePersist
    protected void onCreate() {

        Timestamp timestamp = new Timestamp(new Date().getTime());
    
        Calendar cal = Calendar.getInstance();
        cal.setTimeInMillis(timestamp.getTime());

        Calendar calExpiration = Calendar.getInstance();
        calExpiration.setTimeInMillis(timestamp.getTime());

        calExpiration.add(Calendar.YEAR, 5);

        this.couponCreatedAt = new Timestamp(cal.getTime().getTime());
        this.couponExpiresAt = new Timestamp(calExpiration.getTime().getTime());
    }
   
}
