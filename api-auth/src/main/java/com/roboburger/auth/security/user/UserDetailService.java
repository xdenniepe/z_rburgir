package com.roboburger.auth.security.user;

import java.util.ArrayList;
import java.util.Optional;

import com.roboburger.auth.entity.User;
import com.roboburger.auth.mapper.HibernateFieldMapper;
import com.roboburger.auth.repository.UserRepository;

import org.dozer.DozerBeanMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import com.roboburger.core.security.user.UserCredential;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@AllArgsConstructor
@Slf4j
public class UserDetailService implements UserDetailsService {

  @Autowired
  UserRepository userRepository;

	private DozerBeanMapper dozer;

  @Autowired
	public UserDetailService() {
		this.dozer = new DozerBeanMapper();
		this.dozer.setCustomFieldMapper(new HibernateFieldMapper());

	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

		User user = userRepository.findActiveEmail(username).orElse(null);
		UserCredential credential = new UserCredential();

		if (user == null) {

			user = userRepository.findActivePhoneNumber(username).orElse(null);
			credential.setUsername(user.getPhoneNumber());
			credential.setPassword(user.getPassword());

		} else {

			if ("EXT".equals(user.getStatus())) {
				credential.setUsername(user.getEmail());

				if (user.getGoogleId() != null) {
					credential.setPassword(user.getGoogleId());
				} else if (user.getAppleId() != null) {
					credential.setPassword(user.getAppleId());
				}
			} else if ("ACT".equals(user.getStatus())) {
				credential.setUsername(user.getEmail());
				credential.setPassword(user.getPassword());
			}

		}

		UserPrincipal principal = new UserPrincipal(dozer.map(credential, UserCredential.class), new ArrayList<>());

    	log.info("Username: {}", principal.getUsername());
		log.info("Password: {}", principal.getPassword());

		return principal;

	}
}
