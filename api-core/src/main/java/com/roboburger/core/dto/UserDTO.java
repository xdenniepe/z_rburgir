package com.roboburger.core.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@ToString
public class UserDTO {
  private final Integer userId;
  private final String  email;
  private final String  emailStatus;
  private final String  phoneNumber;
  private final String  phoneNumberStatus;
  private final String  firstName;
  private final String  lastName;
  private final String  password;
  private final String  username;
  private final String  appleId;
  private final String  googleId;
  private final String  oneTimePassword;
  private final Long    otpRequestTime;
}
