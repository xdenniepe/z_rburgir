package com.roboburger.auth.service;

import com.roboburger.auth.entity.User;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import lombok.extern.log4j.Log4j2;

@Service
@Log4j2
public class TwilioService {
    
    @Value("${twilio.account.sid}")
    private String accountSID;

    @Value("${twilio.auth.token}")
    private String authToken;

    @Value("${twilio.sender}")
    private String sender;

    private static final String optOutMsg = "Reply STOP to stop receiving SMS from RoboBurger. ";


    public void sendTextMessage(String messageBody, String recipient) {
        Twilio.init(accountSID, authToken);

        try {
            Message.creator(new PhoneNumber(recipient),
                            new PhoneNumber(sender),
                            messageBody).create();

            log.info("Text message has been sent.");
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    public void sendVerificationSMS(String redirectURL, String code, String recipient) {
        Twilio.init(accountSID, authToken);
      
        try {
            Message.creator(new PhoneNumber(recipient),
                            new PhoneNumber(sender), "Hi, in order to start using your RoboBurger account, you need to confirm your Mobile Number.  " + redirectURL + code + "\n \n" + optOutMsg).create();

            log.info("verification SMS sent.");
            log.info(recipient);
        } catch (Exception ex) {
            ex.printStackTrace();
        } 
    }

    public void sendReceiptSMS(String orderNumber, String location, String receipient, String receiptUrl) {
        Twilio.init(accountSID, authToken);
      
        try {
            Message.creator(new PhoneNumber(receipient),
                            new PhoneNumber(sender), "Hello Human, thank you for your RoboBurger order #" + orderNumber + ". Your RoboBurger will be ready in 4 minutes at "  + location + ". Once it\'s ready, we will hold your RoboBurger Burger for up to 5 minutes in bay, so make sure you\'re here to pick it up. \n \nSEE RECEIPT: " + receiptUrl + "\n \n" + optOutMsg).create();
            log.info("receipt SMS sent.");
         
        } catch (Exception ex) {
            ex.printStackTrace();
        } 
    }
}

