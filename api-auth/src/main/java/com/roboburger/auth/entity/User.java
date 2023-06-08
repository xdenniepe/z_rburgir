package com.roboburger.auth.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.lang.Nullable;

@ToString
@Getter
@Setter
@Entity
@Table(name = "[user]")
public class User extends AbstractEntity implements IEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "user_id")
	private Integer userId;

	@Column(name = "email")
	private String email;

	@Column(name = "email_status")
	private String emailStatus;
	
	@Column(name = "phone_number")
	private String phoneNumber;

	@Column(name = "phone_number_status")
	private String phoneNumberStatus;

	@Column(name = "first_name")
	private String firstName;

	@Column(name = "last_name")
	private String lastName;

	@Column(name = "status")
	private String status;
	
	@JsonIgnore
	@Column(name = "password")
	private String password;

	@Column(name = "apple_id")
	private String appleId;

	@Column(name = "google_id")
	private String googleId;

	@Column(name = "one_time_password")
	@Nullable()
	private String oneTimePassword;

	@Column(name = "otp_request_time")
	private Long otpRequestTime;

	@Column(name = "subscription")
	private String	subscription;

}
