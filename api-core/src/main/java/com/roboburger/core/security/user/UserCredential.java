package com.roboburger.core.security.user;
import java.io.Serializable;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserCredential implements Serializable {
	private static final long serialVersionUID = 1905122041950251207L;

	private Integer userId;
	private String username;
	private String password;
	private String googleId;
	private String status;
	private String loginType;
}
