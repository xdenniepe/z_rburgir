package com.roboburger.auth.controller;

import com.roboburger.auth.entity.User;
import com.roboburger.auth.service.EmailService;
import com.roboburger.auth.service.RegistrationService;
import com.roboburger.auth.service.UserService;
import com.roboburger.core.dto.ReceiptDTO;
import com.roboburger.core.dto.UserDTO;

import io.jsonwebtoken.io.IOException;

import java.util.Locale;

import javax.mail.MessagingException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping(path = "/api")
@Slf4j
public class UserProfileController {

    @Autowired
    private RegistrationService registrationService;

    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;

    /**
     * 
     * @param request
     * @return
     */
    @PostMapping("/users/update")
    public ResponseEntity<User> updateUser(@RequestBody UserDTO request) {
        return ResponseEntity.ok(userService.updateUserProfile(request));
    }

    @PostMapping("/users/receipt")
    public ResponseEntity<Object> sendReceiptEmail(@RequestBody ReceiptDTO request) throws MessagingException, IOException, java.io.IOException {
        log.info("Sending Email Confirmation {}", request.getOrderId());

        HttpStatus status       = null;
        User       user         = userService.findByUserId(request.getUserId()).get();
        Locale     locale       = new Locale.Builder().setLanguage("en").setRegion("US").build();

        emailService.sendReceiptEmail(user, locale, request);

        status = HttpStatus.OK;
        return new ResponseEntity<>(status);
    }
}