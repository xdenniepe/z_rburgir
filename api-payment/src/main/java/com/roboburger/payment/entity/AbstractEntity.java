package com.roboburger.payment.entity;

import java.time.Instant;

import javax.persistence.*;

import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public class AbstractEntity {

  @Column(name = "who_added")
  @CreatedBy
  protected Integer whoAdded;

  @Column(name = "who_updated", nullable = true)
  @LastModifiedBy
  protected Integer whoUpdated;

  @Column(name = "when_added", nullable = true)
  protected Integer whenAdded;

  @Column(name = "timestamp", nullable = true)
  protected Integer timestamp;

  @PrePersist
  protected void onCreate() {
    Long unixTime = Instant.now().getEpochSecond();
    this.whenAdded = this.timestamp = unixTime.intValue();
  }

  @PreUpdate
  protected void onUpdate() {
    Long unixTime = Instant.now().getEpochSecond();
    this.timestamp = unixTime.intValue();
  }

}