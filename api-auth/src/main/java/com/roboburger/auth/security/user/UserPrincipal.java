package com.roboburger.auth.security.user;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import com.roboburger.core.security.user.UserCredential;

public class UserPrincipal implements UserDetails {
    
	private UserCredential user;
	private List<GrantedAuthority> authorities;

	public UserPrincipal(UserCredential user, List<GrantedAuthority> grantedAuths) {
		this.user = user;
		this.authorities = grantedAuths;
	}

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return authorities;
  }

  @Override
  public String getPassword() {
    return this.user.getPassword();
  }

  @Override
  public String getUsername() {
    return this.user.getUsername();
  }

  @Override 
  public boolean isAccountNonExpired() {
    return true;
  }

  @Override
  public boolean isAccountNonLocked() {
    return true;
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return true;
  }

  @Override
  public boolean isEnabled() {
    return true ;
  }
  
}
