package com.roboburger.auth.controller;

import java.io.IOException;

import javax.mail.MessagingException;

import com.roboburger.auth.dto.EmailVerificationDTO;
import com.roboburger.auth.dto.NewPasswordDTO;
import com.roboburger.auth.entity.User;
import com.roboburger.auth.entity.Verification;
import com.roboburger.auth.service.RegistrationService;
import com.roboburger.auth.service.UserService;
import com.roboburger.auth.service.VerificationService;
import com.roboburger.core.dto.UserDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping(path = "/api/public")
@Slf4j
public class UserController {

    @Autowired
    private RegistrationService registrationService;

    @Autowired
    private UserService userService;
    
    @Autowired
    private VerificationService verificationService;

    /**
     * 
     * @return
     */
    @GetMapping("/search/findByToken")
    public ResponseEntity<Object> getUser() {
        log.info("GET USER by Token API");

        final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!(authentication instanceof AnonymousAuthenticationToken)) {
            log.info("Name: {}", authentication.getName());
            User user = userService.findActiveEmail(authentication.getName()).orElse(null);

            if (user == null) {
                user = userService.findActivePhoneNumber(authentication.getName()).orElse(null);
            }

            return new ResponseEntity<>(user, HttpStatus.OK);
        }

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    /**
     * 
     * @param request
     * @return
     */
    @GetMapping("/search/findByEmail")
    public ResponseEntity<User> findByEmail(@RequestParam("email") String email) {
        log.info("Checking user with {}", email);

        User user = userService.findActiveEmail(email).orElse(null);

        HttpStatus status;
        
        if (user == null) {
            status = HttpStatus.NOT_FOUND;
        } else {
            status = HttpStatus.OK;
        }

        return new ResponseEntity<>(user, status);

    }

    @GetMapping("/search/findByPhoneNumber")
    public ResponseEntity<User> findByPhoneNumber(@RequestParam("phoneNumber") String phoneNumber) {
        log.info("Checking user with {}", phoneNumber);

        User user = userService.findActivePhoneNumber(phoneNumber).orElse(null);

        HttpStatus status;

        if (user == null) {
            status = HttpStatus.NOT_FOUND;
        } else {
            status = HttpStatus.OK;
        }

        return new ResponseEntity<>(user, status);

    }
    
    @GetMapping("/verification")
    public ResponseEntity<Object> findByVerificationCode(@RequestParam("userId") Integer userId) {
        Verification user = verificationService.findByUserId(userId).get();
        String       code = user.getCode();

        if (code != null) {
            return new ResponseEntity<>(code, HttpStatus.OK);
        }
        
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping("/verification/forgotpassword")
    public ResponseEntity<String> findFPVerification(@RequestParam("userId") Integer userId) {
        Verification user = verificationService.findUserFPCode(userId).get();

        log.info("User verification: {}", user);
        String       code = user.getCode();

        if (code != null) {
            return new ResponseEntity<>(code, HttpStatus.OK);
        }
        
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    /**
     * 
     * @return
     */
    @GetMapping("/authorization")
    public boolean checkAuthorization() {
        final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        log.info("authentication: {}", authentication.getPrincipal());

        if (!(authentication instanceof AnonymousAuthenticationToken)) {
            log.info("Name: {}", authentication);

            if (!userService.findActiveEmail(authentication.getName()).isEmpty() || !userService.findActivePhoneNumber(authentication.getName()).isEmpty()) {
                return true;
            }
        }

        return false;
    }

    /**
     * 
     * @param request
     * @return
     */
    @PostMapping("/register")
    public ResponseEntity<UserDTO> register(@RequestBody UserDTO request) {
        return ResponseEntity.ok(registrationService.register(request));
    }

    /**
     * 
     * @param request
     * @return
     * @throws MessagingException
     * @throws IOException
     */
    @PostMapping("/register/verify")
    public ResponseEntity<String> signUpVerification(@RequestBody EmailVerificationDTO request) throws MessagingException, IOException {
        return registrationService.verifyUser(request);
    }

    /**
     * 
     * @param request
     * @return
     */
    @PostMapping("/users/update/verify")
    public ResponseEntity<String> updateVerification(@RequestBody EmailVerificationDTO request) throws MessagingException, IOException {
        return registrationService.verifyUserUpdate(request);
    }

     /**
     * 
     * @param code
     * @return
     */
    @GetMapping("/register/verify/{code:.+}")
    public ResponseEntity<String> verifySignUpCode(@PathVariable("code") String code) {
        return registrationService.verfiyCode(code);
    }

     /**
     * 
     * @param code
     * @return
     */
    @PostMapping("/unsubscribe/{code:.+}")
    public ResponseEntity<User> unsubscribeEmail(@PathVariable("code") String code) {
        return registrationService.verifyUnsubscribe(code);
    }

    @PostMapping("/register/verify/appleAccount")
    public ResponseEntity<User> appleAccountVerification(@RequestBody UserDTO request) throws MessagingException, IOException {
        log.info("apple request: ", request);
        return registrationService.verifyAppleAccount(request);
    }

    @PostMapping("/register/verify/googleAccount")
    public ResponseEntity<User> googleAccountVerification(@RequestBody UserDTO request) throws MessagingException, IOException {
        return registrationService.verifyGoogleAccount(request);
    }

    /**
     * 
     * @param request
     * @return
     * @throws MessagingException
     * @throws IOException
     */
    @PostMapping("/forgotPassword")
    public ResponseEntity<Object> forgotPasswordRequest(@RequestBody EmailVerificationDTO request)
            throws MessagingException, IOException {
        return new ResponseEntity<>(userService.forgotPasswordRequest(request));
    }

    @PostMapping("/forgotPassword/createOtp")
    public ResponseEntity<User> updateOtp(@RequestBody UserDTO request) throws MessagingException, io.jsonwebtoken.io.IOException {
        log.info("Creating OTP with {}", request);

        return ResponseEntity.ok(userService.updateOtp(request));
    }

    @PostMapping("/forgotPassword/clearOtp")
    public ResponseEntity<User> clearOtp(@RequestBody UserDTO request) throws MessagingException, io.jsonwebtoken.io.IOException {
        log.info("Clearing OTP with {}", request);

        return ResponseEntity.ok(userService.clearOtp(request));
    }

    /**
     * RESEND CODE
     *  
     * @param code
     * @param resendRequest
     * @return
     */
    @GetMapping("/newPassword/{code:.+}")
    public ResponseEntity<Object> redirectToCreateNewPassword(@PathVariable("code") String code,
            @RequestParam("resendRequest") boolean resendRequest) {
        return new ResponseEntity<>(userService.createNewPassword(code, resendRequest));
    }

    /**
     * 
     * @param request
     * @return
     */
    @PostMapping("/newPassword")
    public ResponseEntity<Object> updateUserPassword(@RequestBody NewPasswordDTO request) {
        return new ResponseEntity<>(userService.updateUserPassword(request));

    }
}
