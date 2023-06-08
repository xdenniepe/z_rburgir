package com.roboburger.auth.service;

import com.roboburger.auth.dto.EmailVerificationDTO;
import com.roboburger.auth.entity.User;
import com.roboburger.auth.entity.Verification;
import com.roboburger.auth.repository.UserRepository;
import com.roboburger.auth.repository.VerificationRepository;
import com.roboburger.auth.utility.Constants;
import com.roboburger.core.dto.UserDTO;
import com.roboburger.core.dto.ReceiptDTO;

import java.io.IOException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Locale;
import java.util.Optional;

import javax.mail.MessagingException;

import org.dozer.DozerBeanMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@AllArgsConstructor
@Slf4j
public class RegistrationService {


    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private TwilioService twilioService;

    @Autowired
    private VerificationRepository verificationRepository;


    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final DozerBeanMapper dozer;

    private final Long unixTime = Instant.now().getEpochSecond();
    private final int now = unixTime.intValue();
    private final LocalDateTime expiration = LocalDateTime.now().plusMinutes(5);

    @Autowired
    public RegistrationService() {
        this.dozer = new DozerBeanMapper();
        this.bCryptPasswordEncoder = new BCryptPasswordEncoder();
    }

    public void createNewInactiveUser (UserDTO dto) {

        User newUser = new User();
        newUser.setPhoneNumber(dto.getPhoneNumber());
        newUser.setEmail(dto.getEmail());
        newUser.setPassword(bCryptPasswordEncoder.encode(dto.getPassword()));
        newUser.setStatus("INA");
        newUser.setPhoneNumberStatus("INA");
        newUser.setEmailStatus("INA");
        newUser.setSubscription("ACT");
        log.info("saving new inactive user");
        dozer.map(userRepository.save(newUser), dto);
    }

    /**
     * 
     * @param dto
     * @return
     */
    public UserDTO register(UserDTO dto) {
        Optional<User> userExists;
       
        userExists = userRepository.findActiveEmail(dto.getEmail());

        if (userExists.isEmpty()) {
            userExists = userRepository.findActivePhoneNumber(dto.getPhoneNumber());
        }

        User user;
        if (userExists.isPresent()) {
            
            throw new IllegalStateException("Email Already Exists!");

        } else {
            userExists = userRepository.findInActiveEmail(dto.getEmail());

            if (userExists.isEmpty()) {
                userExists = userRepository.findInActivePhone(dto.getPhoneNumber());
            }

            if (userExists.isEmpty()) {
                createNewInactiveUser(dto);
            } else {
                user = userExists.get();

                Optional<User> inactiveUser;
                inactiveUser = userRepository.findInActiveDuplicateEmail(user.getEmail(), user.getUserId());

                if (inactiveUser.isEmpty()) {
                    inactiveUser = userRepository.findInActiveDuplicatePhoneNumber(user.getPhoneNumber(), user.getUserId());
                }

                if (inactiveUser.isEmpty()) {
                    if (userRepository.findInActiveEmail(user.getEmail()).isEmpty() && userRepository.findInActivePhone(user.getPhoneNumber()).isEmpty()) {
                        createNewInactiveUser(dto);
                    } else {
                        
                        if (userRepository.findInActiveEmail(user.getEmail()).isEmpty() && dto.getPhoneNumber() != null && userRepository.findInActivePhone(dto.getPhoneNumber()).isEmpty()) {
                            
                            createNewInactiveUser(dto);
                            return dto;
                        }

                        if (!userRepository.findInActiveEmail(user.getEmail()).isEmpty() && dto.getPhoneNumber() != null && userRepository.findInActivePhone(dto.getPhoneNumber()).isEmpty()) {
                            
                            createNewInactiveUser(dto);
                            return dto;
                        }
                        
                        if (userRepository.findInActivePhone(user.getPhoneNumber()).isEmpty() && dto.getEmail() != null && userRepository.findInActiveEmail(dto.getEmail()).isEmpty()) { 
                            
                            createNewInactiveUser(dto);
                            return dto;
                        }

                        if (!userRepository.findInActivePhone(user.getPhoneNumber()).isEmpty() && dto.getEmail() != null && userRepository.findInActiveEmail(dto.getEmail()).isEmpty()) {
                            
                            createNewInactiveUser(dto);
                            return dto;
                        }

                        user.setPhoneNumber(dto.getPhoneNumber());
                        user.setEmail(dto.getEmail());
                        user.setPassword(bCryptPasswordEncoder.encode(dto.getPassword()));
                        user.setStatus("INA");
                        user.setPhoneNumberStatus("INA");
                        user.setEmailStatus("INA");

                        dozer.map(userService.updateUser(user), dto);
                    }
                }

                dozer.map(userService.updateUser(user), dto);
            }

        }

        return dto;
    }

    /**
     * 
     * @param request
     * @return
     * @throws MessagingException
     * @throws IOException
     */
    public ResponseEntity<String> verifyUser (EmailVerificationDTO request) 
                                            throws MessagingException, IOException {
        log.info("Sending Email Confirmation {}", request.getEmail());

        String[] baseURL   = request.getBaseUrl().split("/");
        boolean isLocal    = baseURL[2].contains(Constants.LOCALHOST);
        String homeURL     = (isLocal ? Constants.URL_PROTOCOL_UNSECURED : Constants.URL_PROTOCOL_SECURED) + baseURL[2];
        String redirectURL = (isLocal ? Constants.URL_PROTOCOL_UNSECURED : Constants.URL_PROTOCOL_SECURED) + baseURL[2] + Constants.EMAIL_VERIFIED_URI;
        Locale locale      = new Locale.Builder().setLanguage("en").setRegion("US").build();
        User rbUser        = null;
        String code        = "";
        String code_uns    = "";
        
        if (request.getEmail() != null) {
            rbUser     = userRepository.findInActiveEmail(request.getEmail()).get();
            code       = userService.generateCode(rbUser.getUserId(), Constants.EMAIL_VERIFICATION_REQUEST, "UUID");
            code_uns   = userService.generateCode(rbUser.getUserId(), Constants.UNSUBSCRIBE_VERIFICATION_REQUEST, "UUID");

            emailService.sendEmailVerificationEmail(rbUser, locale, homeURL, redirectURL, code);    
        }  
        
        if (request.getPhoneNumber() != null) {
            rbUser = userRepository.findInActivePhone(request.getPhoneNumber()).get();
            code   = userService.generateCode(rbUser.getUserId(), Constants.PHONE_VERIFICATION_REQUEST, "UUID");

            twilioService.sendVerificationSMS(redirectURL, code, request.getPhoneNumber());
        } 

        log.info("Sending to EmailService: {}, {}, {}, {}, {}", request.getEmail());
        
        return new ResponseEntity<>(HttpStatus.OK);
    }

    public ResponseEntity<String> verifyUserUpdate (EmailVerificationDTO request) 
                                            throws MessagingException, IOException {
        log.info("Sending Email Confirmation {}", request.getEmail());

        String[] baseURL   = request.getBaseUrl().split("/");
        boolean isLocal    = baseURL[2].contains(Constants.LOCALHOST);
        String homeURL     = (isLocal ? Constants.URL_PROTOCOL_UNSECURED : Constants.URL_PROTOCOL_SECURED) + baseURL[2];
        String redirectURL = (isLocal ? Constants.URL_PROTOCOL_UNSECURED : Constants.URL_PROTOCOL_SECURED) + baseURL[2] + Constants.EMAIL_VERIFIED_URI;
        Locale locale      = new Locale.Builder().setLanguage("en").setRegion("US").build();
        User rbUser        = null;
        String code        = "";
        
        if (request.getEmail() != null) {
            rbUser = userRepository.findInActiveEmailOnActiveUser(request.getEmail()).get();
            code   = userService.generateCode(rbUser.getUserId(), Constants.EMAIL_VERIFICATION_REQUEST, "UUID");

            emailService.sendEmailVerificationEmail(rbUser, locale, homeURL, redirectURL, code);
        }  
        
        if (request.getPhoneNumber() != null) {
            rbUser = userRepository.findInActivePhoneOnActiveUser(request.getPhoneNumber()).get();
            code   = userService.generateCode(rbUser.getUserId(), Constants.PHONE_VERIFICATION_REQUEST, "UUID");

            twilioService.sendVerificationSMS(redirectURL, code, request.getPhoneNumber());
        } 

        log.info("Sending to EmailService: {}, {}, {}, {}, {}", request.getEmail());
        
        return new ResponseEntity<>(HttpStatus.OK);
    }

    public ResponseEntity<User> verifyAppleAccount (UserDTO request) {
        User appleUser = userService.findActiveEmail(request.getEmail()).orElse(null);
        User rbUser        = null;
        String code        = "";
        
        if (appleUser == null || "INA".equals(appleUser.getStatus())) {
            log.info("Saving external user {}", appleUser);
            
            appleUser = dozer.map(request, User.class);
            log.info("user ->", appleUser);
            appleUser.setPassword(bCryptPasswordEncoder.encode(request.getPassword()));
            appleUser.setAppleId(bCryptPasswordEncoder.encode(appleUser.getAppleId()));
            appleUser.setStatus("EXT");
            appleUser.setEmailStatus("ACT");
            appleUser.setSubscription("ACT");

            userRepository.save(appleUser);
        } else {
            log.error("Email Already Exists: {}", appleUser.getEmail());
        }

        code   = userService.generateCode(appleUser.getUserId(), Constants.UNSUBSCRIBE_VERIFICATION_REQUEST, "UUID");

        return new ResponseEntity<>(appleUser, HttpStatus.OK);
    }

    public ResponseEntity<User> verifyGoogleAccount (UserDTO request) {
        User googleUser = userService.findActiveEmail(request.getEmail()).orElse(null);
        User rbUser        = null;
        String code        = "";
        
        if (googleUser == null || "INA".equals(googleUser.getStatus())) {
            log.info("Saving external user {}", googleUser);
            
            googleUser = dozer.map(request, User.class);
            log.info("user ->", googleUser);
            googleUser.setPassword(bCryptPasswordEncoder.encode(request.getPassword()));
            googleUser.setGoogleId(bCryptPasswordEncoder.encode(googleUser.getGoogleId()));
            googleUser.setEmailStatus("ACT");
            googleUser.setStatus("EXT");
            googleUser.setSubscription("ACT");
            
            userRepository.save(googleUser);
        } else {
            log.error("Email Already Exists: {}", googleUser.getEmail());
        }

        code   = userService.generateCode(googleUser.getUserId(), Constants.UNSUBSCRIBE_VERIFICATION_REQUEST, "UUID");

        return new ResponseEntity<>(googleUser, HttpStatus.OK);
    }

    /**
     * 
     * @param user
     */
    public HttpStatus checkDuplicateAccount (User user, Integer verificationid) {

        Optional<User> checkUser; 
        // to do check user with same email and phone and not equal the verified user ID
        checkUser = userRepository.findInActiveDuplicateEmail(user.getEmail(), user.getUserId());

        if (checkUser.isEmpty()) {
            log.info("user empty");
            checkUser = userRepository.findInActiveDuplicatePhoneNumber(user.getPhoneNumber(), user.getUserId());

        }

        if (checkUser.isPresent()) {
            // to do, delete existing inactive duplicate user via phone and email

            if (checkUser.get().getEmail() == null || 
                checkUser.get().getPhoneNumber() == null) {
                    log.info("deleting duplicated user");

                    Verification verification = verificationRepository.findByUserId(checkUser.get().getUserId()).orElse(null);

                    if (verification != null) {
                        verificationRepository.delete(verification);
                        userRepository.deleteById(checkUser.get().getUserId());
                    }
                  
            } else {

                log.info("updating duplicated user");
                if (checkUser.get().getEmail() != null) {
                    checkUser.get().setPhoneNumber(null);

                    userRepository.save(checkUser.get());
                } else {
                    checkUser.get().setEmail(null);

                    userRepository.save(checkUser.get());
                }             
            }
        }

        return HttpStatus.OK;

    }

     /**
     * 
     * @param code
     * @return
     */
    public ResponseEntity<String> verfiyCode (String code) {
        HttpStatus status = null;

        Verification verification = verificationRepository.findByCode(code).orElse(null);

        if (verification != null) {
            
            User user = userService.findByUserId(verification.getUserId()).orElse(null);

            if (verification.getStatus().equals(Constants.INACTIVE_CODE)) {
                log.info("INACTIVE CODE");
                if (now < verification.getExpiration()) {
                    status = HttpStatus.NOT_FOUND;
                } else {
                    status = HttpStatus.BAD_REQUEST;
                }
            } else {
                if (now > verification.getExpiration()) {
                    status = HttpStatus.BAD_REQUEST;
                } else {
                    
                    verification.setStatus(Constants.INACTIVE_CODE);    
                    verification.setWhoUpdated(user.getUserId());
                    verificationRepository.save(verification);
                    
                    user.setWhoUpdated(user.getUserId());
                    user.setStatus("ACT");
                    
                    if (verification.getType().equalsIgnoreCase(Constants.EMAIL_VERIFICATION_REQUEST)) {
                        user.setEmailStatus("ACT");
                    }

                    if (verification.getType().equalsIgnoreCase(Constants.PHONE_VERIFICATION_REQUEST)) {
                        user.setPhoneNumberStatus("ACT");
                    }

                    status = checkDuplicateAccount(userRepository.save(user), verification.getVerificationId());
                }
            }
        } else {

            log.info("CODE DOES NOT EXISTS");
            status = HttpStatus.NOT_FOUND;

        }

        return new ResponseEntity<>(status); 
    }

      /**
     * 
     * @param code
     * @return
     */
    public ResponseEntity<User> verifyUnsubscribe (String code) {
        HttpStatus status = null;

        Verification verification = verificationRepository.findByCode(code).orElse(null);
        User user = new User();
        if (verification != null) {
            
            user = userService.findByUserId(verification.getUserId()).orElse(null);

            if (verification.getStatus().equals(Constants.INACTIVE_CODE)) {
                log.info("INACTIVE CODE");
                if (now < verification.getExpiration()) {
                    status = HttpStatus.NOT_FOUND;
                } else {
                    status = HttpStatus.BAD_REQUEST;
                }
            } else {
                if (now > verification.getExpiration()) {
                    status = HttpStatus.BAD_REQUEST;
                } else {
                    
                    verification.setStatus(Constants.INACTIVE_CODE);    
                    verification.setWhoUpdated(user.getUserId());
                    verificationRepository.save(verification);
                    
                    user.setWhoUpdated(user.getUserId());
                    user.setSubscription("INA");

                    userRepository.save(user);

                    status = HttpStatus.OK;
                }
            }
        } else {

            log.info("CODE DOES NOT EXISTS");
            status = HttpStatus.NOT_FOUND;

        }

        return new ResponseEntity<>(user, status); 
    }

}
