package com.roboburger.auth.service;

import java.util.Optional;
import java.util.Random;

import javax.mail.MessagingException;

import java.util.Locale;
import java.time.Instant;
import java.time.LocalDateTime;
import java.io.IOException;

import com.roboburger.auth.dto.EmailVerificationDTO;
import com.roboburger.auth.dto.NewPasswordDTO;
import com.roboburger.auth.entity.User;
import com.roboburger.auth.entity.Verification;
import com.roboburger.auth.repository.UserRepository;
import com.roboburger.core.dto.UserDTO;
import com.roboburger.auth.utility.Constants;
import com.roboburger.core.utility.Utility;

import org.dozer.DozerBeanMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class UserService {

	@Autowired
	private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private VerificationService verificationService;

    @Autowired
    private TwilioService twilioService;

    @Autowired
    private BCryptPasswordEncoder encryptPassword;

    private final BCryptPasswordEncoder bCryptPasswordEncoder;
	private final DozerBeanMapper dozer;

    private final Long unixTime = Instant.now().getEpochSecond();
    private final int now = unixTime.intValue();
    private final LocalDateTime expiration = LocalDateTime.now().plusMinutes(5);

	@Autowired
	public UserService() {
		this.dozer = new DozerBeanMapper();
        this.bCryptPasswordEncoder = new BCryptPasswordEncoder();
	}

    /**
     * 
     * @param user
     * @return
     */
	public User updateUser(User user) {
		return userRepository.save(user);
	}

    /**
     * 
     * @param email
     * @return
     */
	public Optional<User> findByEmail(String email) {
		return userRepository.findByEmail(email);
	}
    

    /**
     * 
     * @param email
     * @return
     */
	public Optional<User> findActiveEmail(String email) {
		return userRepository.findActiveEmail(email);
	}


    /**
     * 
     * @param phoneNumber
     * @return
     */
	public Optional<User> findByPhoneNumber(String phoneNumber) {
		return userRepository.findByPhoneNumber(phoneNumber);
	}

    /**
     * 
     * @param phoneNumber
     * @return
     */
	public Optional<User> findActivePhoneNumber(String phoneNumber) {
		return userRepository.findActivePhoneNumber(phoneNumber);
	}

    /**
     * 
     * @param userId
     * @return
     */
	public Optional<User> findByUserId(Integer userId) {
		return userRepository.findByUserId(userId);
	}

    /**
     * 
     * @param userData
     * @return
     */
    public User updateUserProfile(UserDTO userData) {
        // User existingUser = userRepository.findActiveEmail(userData.getEmail()).get();
        String email       = userData.getEmail();
        String phoneNumber = userData.getPhoneNumber();

        User activeUser = null;

        Optional<User> activeEmail       = userRepository.findActiveEmail(email);
        Optional<User> activePhoneNumber = userRepository.findActivePhoneNumber(phoneNumber);

        if (activeEmail.isPresent()) {
            activeUser = activeEmail.get();
        } else if (activePhoneNumber.isPresent()) {
            activeUser = activePhoneNumber.get();
        }

        activeUser.setEmail(email);
        activeUser.setPhoneNumber(phoneNumber);
        activeUser.setFirstName(userData.getFirstName());
        activeUser.setLastName(userData.getLastName());
        activeUser.setEmailStatus(userData.getEmailStatus());
        activeUser.setPhoneNumberStatus(userData.getPhoneNumberStatus());
        
        try {
            if (!userData.getPassword().isBlank()) {
                activeUser.setPassword(bCryptPasswordEncoder.encode(userData.getPassword()));
            }
        } catch (Exception e) {
            log.info("Error : {}", e);
        }
        
		return userRepository.save(activeUser);
    }

    /**
     * 
     * @param userId
     * @param requestType
     * @param method
     * @return
     */
    public String generateCode(Integer userId, String requestType, String method) {

        Verification verification = new Verification();
        String code = "";

        Optional<Verification> user = verificationService.findByUserIdAndStatus(userId, "ACT", requestType);

        if (user.isPresent()) {
            verification = user.get();
            verification.setType(requestType);
            verification.setWhoUpdated(userId);
            if (user.get().getExpiration() < now) {
                verification.setExpiration(Utility.convertLocalDateToLong(expiration));
                verification.setStatus(Constants.ACTIVE_CODE);

                if ("OTP".equals(method)) {
                    verification.setCode(getRandomNumberString());
                } else {
                    verification.setCode(Utility.generateUUID());
                }
               
                verificationService.setVerification(verification);
            } else {
                verification.setStatus(Constants.INACTIVE_CODE);
                verificationService.setVerification(verification);
                addVerification(verification, expiration, requestType, userId, method);
            }
           
        } else {
            log.info("Creating new user verification: {}");
            addVerification(verification, expiration, requestType, userId, method);
        }

        code = verification.getCode();
        return code;

    }

    /**
     * 
     * @param verification
     * @param expiration
     * @param requestType
     * @param userId
     * @param method
     */
    private void addVerification(Verification verification, LocalDateTime expiration, String requestType,
            Integer userId, String method) {

        verification.setExpiration(Utility.convertLocalDateToLong(expiration));
        verification.setStatus(Constants.ACTIVE_CODE);
        verification.setType(requestType);
        verification.setUserId(userId);
        verification.setWhoAdded(userId);
        
        if ("OTP".equals(method)) {
            verification.setCode(getRandomNumberString());
        } else {
            verification.setCode(Utility.generateUUID());
        }
        verificationService.setVerification(verification);
    }
    
    /**
     * 
     * @return
     */
    public static String getRandomNumberString() {
        Random rnd = new Random();
        int number = rnd.nextInt(999999);

        return String.format("%06d", number);
    }

    /**
     * 
     * @param request
     * @return
     * @throws MessagingException
     * @throws IOException
     */
    public HttpStatus forgotPasswordRequest (EmailVerificationDTO request) throws MessagingException, IOException {
        log.info("request data: {}", request);

        String[] baseURL   = null;
        String email       = request.getEmail();
        String phoneNumber = request.getPhoneNumber();
        User user          = null;
        HttpStatus status  = null;
        boolean isValidDNS = false;
        String timeZone    = request.getTimeZone();

        if (email != null) {
            log.info("email is present: {}", email);

            baseURL = request.getBaseUrl().split("/");

            if (baseURL[2].equals(Constants.LOCAL_BASE_URL)) {
                isValidDNS = true;
                log.info("This is valid DNS");
            }

            // TODO: Remove this Host Address for TST (in Prod Env)
            boolean isLocal    = baseURL[2].contains(Constants.LOCALHOST) || baseURL[2].contains("52.177.36.185"); 
            String homeURL     = (isLocal ? Constants.URL_PROTOCOL_UNSECURED : Constants.URL_PROTOCOL_SECURED) + baseURL[2];
            String redirectURL = (isLocal ? Constants.URL_PROTOCOL_UNSECURED : Constants.URL_PROTOCOL_SECURED) + baseURL[2] + Constants.NEW_PASSWORD_URI;
            Locale locale      = new Locale.Builder().setLanguage("en").setRegion("US").build();
            user               = userRepository.findActiveEmail(email).get();
            String code        = generateCode(user.getUserId(), Constants.FORGOT_PASSWORD_REQUEST, "UUID");

            log.info("Sending to EmailService: {}, {}, {}, {}, {}", user, locale, homeURL, redirectURL, code);
            emailService.sendForgotPasswordEmail(user, locale, homeURL, redirectURL, code, timeZone);

            status = HttpStatus.OK;
        } else if (phoneNumber != null) {
            user            = userRepository.findActivePhoneNumber(phoneNumber).get();
            String userOTP  = user.getOneTimePassword();
            generateCode(user.getUserId(), Constants.FORGOT_PASSWORD_REQUEST, "UUID");
            status          = sendForgotPasswordSMS(userOTP, user);
        } else {
            status = HttpStatus.BAD_REQUEST;
        }

        log.info("user - status: {}", status);

        return status;
    }

    public User updateOtp(UserDTO userData) {
        log.info("userData: {}", userData);

        Long unixTime = Instant.now().getEpochSecond();

        User user          = null;
        String email       = userData.getEmail();
        String phoneNumber = userData.getPhoneNumber();

        log.info("email: {}, phone number: {}", email, phoneNumber);

        if (email != null) {
            log.info("email is present: {}", email);
            user = userRepository.findActiveEmail(email).get();
        } else if (phoneNumber != null) {
            log.info("phone is present: {}", phoneNumber);
            user = userRepository.findActivePhoneNumber(phoneNumber).get();
        }

        log.info("user: {}", user);

        user.setOneTimePassword(getRandomNumberString());
        user.setOtpRequestTime(unixTime);
        log.info("OTP SENT");

        return userRepository.save(user);
    }

    public User clearOtp(UserDTO userData) {
        User existingUser = userRepository.findActiveEmail(userData.getEmail()).get();
        User user = dozer.map(existingUser, User.class);

        user.setOneTimePassword(null);
        user.setOtpRequestTime(null);
        log.info("OTP CLEARED");

        return userRepository.save(user);
    }

    /**
     * 
     * @param code
     * @param user
     * @return
     */
    private HttpStatus sendForgotPasswordSMS(String code, User user) {
        try {
            log.info("Sending to TwilioService : To - {}, code - {}", user.getPhoneNumber(), code);
            twilioService.sendTextMessage("We have recently received a request for a password reset. Your forgot password verification code is: " + code +  ". If you didn't initiate this request, please ignore this SMS.", "+" + user.getPhoneNumber());
            return HttpStatus.OK;
        } catch (Exception e) {
            log.info("Error : {}", e);
            return HttpStatus.BAD_REQUEST;
        }
    }

    /**
     * 
     * @param code
     * @param resendRequest
     * @return
     */
    public HttpStatus createNewPassword (String code, boolean resendRequest) {
        HttpStatus status = null;

        if (verificationService.findByCode(code).isPresent()) {
            Verification verification = verificationService.findByCode(code).get();

            log.info("Code: " + verification.getCode());
            log.info("Resend Request: " + resendRequest);
            log.info("STATUS: " + verification.getStatus());

            if (resendRequest) {
                log.info("RESEND REQUEST: true");
                Optional<User> optUser = findByUserId(verification.getUserId());
                if (optUser.isPresent()) {
                    User user = optUser.get();
                    log.info("PHONE NUMBER: " + user.getPhoneNumber());
                    if (verification.getStatus().equals(Constants.ACTIVE_CODE)) {
                        verification.setStatus(Constants.INACTIVE_CODE);
                        verificationService.setVerification(verification);
                    }
                    String newCode = generateCode(user.getUserId(), Constants.FORGOT_PASSWORD_REQUEST, "OTP");
                    status = sendForgotPasswordSMS(newCode, user);

                } else {
                    log.info("USER DOES NOT EXISTS");
                    status = HttpStatus.NOT_FOUND;
                }
            } else {
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
                        status = HttpStatus.OK;
                    }
                }
            }
        } else {
            log.info("CODE DOES NOT EXISTS");
            status = HttpStatus.NOT_FOUND;

        }

        return status;
    }

    /**
     * 
     * @param request
     * @return
     */
    public HttpStatus updateUserPassword (NewPasswordDTO request) {
        log.info("updateUserPassword() begin");

        HttpStatus status             = null;
        Verification userVerification = verificationService.findByCode(request.getCode()).get();
        User user                     = userRepository.findByUserId(userVerification.getUserId()).get();

        log.info("user {}", user);

        if (user != null) {
            user.setPassword(encryptPassword.encode(request.getNewPassword()));
            updateUser(user);

            status = HttpStatus.OK;
        } else {
            status = HttpStatus.NOT_FOUND;
        }

        log.info("updateUserPassword() end");

        return status;
    }
}
