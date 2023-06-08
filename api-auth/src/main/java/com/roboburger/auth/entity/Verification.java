package com.roboburger.auth.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name= "[verification]")
public class Verification extends AbstractEntity implements IEntity {
  
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "verification_id")
  private Integer verificationId;

  @Column(name = "verification_user_id")
  private Integer userId;

  @Column(name = "code")
  private String code;

  @Column(name = "type")
  private String type;

  @Column(name = "expiration_date")
  private Long expiration;

  @Column(name = "status")
  private String status;
}
