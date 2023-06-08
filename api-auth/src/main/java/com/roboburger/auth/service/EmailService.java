package com.roboburger.auth.service;

import java.io.IOException;
import java.text.DateFormat;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.TimeZone;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

import com.roboburger.auth.entity.User;
import com.roboburger.core.dto.CondimentOrderDTO;
import com.roboburger.core.dto.ProductOrderDTO;
import com.roboburger.core.dto.ReceiptDTO;
import com.roboburger.core.dto.VendingMachineDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import lombok.extern.log4j.Log4j2;
import com.roboburger.auth.service.TwilioService;
import com.roboburger.auth.repository.VerificationRepository;


@Service
@Log4j2
public class EmailService {
    
    @Autowired
    private JavaMailSender mailSender;

    @Autowired 
    private VerificationRepository verificationRepository;

    @Qualifier("email")
    @Autowired
    private TemplateEngine htmlTemplateEngine;

    @Value("${mail.server.from}")
    private String serverFrom;

    private String receiptDetails = "";

    @Autowired
    private TwilioService twilioService;

    public ResponseEntity<Object> sendForgotPasswordEmail(User user, Locale locale, String homeURL, String redirectURL, String code, String timeZone) throws MessagingException, IOException {
        log.info("SEND FORGOT PASSWORD EMAIL () BEGIN -- {}", serverFrom);
        log.info("Locale Variable: {}, User: {} [{}], HomeURL: {}, RedirectURL: {}, Code: {}", locale, user, user.getEmail(), homeURL, redirectURL, code);

        final Context context                 = new Context(locale);
        final MimeMessage mimeMessage         = this.mailSender.createMimeMessage();
        final MimeMessageHelper messageHelper = new MimeMessageHelper(mimeMessage, "UTF-8");
        final String emailSubject             = "Your verification code";
     
        Date date = new Date();
        SimpleDateFormat sdf = new SimpleDateFormat("MM/dd/yyyy");
        sdf.setTimeZone(TimeZone.getTimeZone(timeZone));
        SimpleDateFormat timeOnly = new SimpleDateFormat("hh:mm aa");
        timeOnly.setTimeZone(TimeZone.getTimeZone(timeZone));

        context.setVariable("homeURL", homeURL);
        context.setVariable("title", emailSubject);
        context.setVariable("firstName", user.getFirstName());
        context.setVariable("lastName", user.getLastName());
        context.setVariable("email", user.getEmail());
        context.setVariable("contentBody1", "We have recently received a request for a password reset. Please see your verification code requested on " + sdf.format(date) + " at " + timeOnly.format(date) + ".");
        context.setVariable("otp", user.getOneTimePassword());
        context.setVariable("contentBody2", "If you didn't initiate this request, please ignore this email.");
        context.setVariable("redirectURL", (redirectURL + code + "?resendRequest=false"));
        context.setVariable("buttonLabel", "Click to Continue");
        context.setVariable("brand", "RoboBurger");

        messageHelper.setSubject(emailSubject);
        messageHelper.setFrom(serverFrom);
        messageHelper.setTo(user.getEmail());

        log.info("SET HTML CONTENT");
        final String htmlContent = this.htmlTemplateEngine.process("templates/forgot-password", context);
        messageHelper.setText(htmlContent, true /* is HTML */);

        // SEND EMAIL
        HttpStatus status;
        try {
            log.info("SENDING EMAIL...");
            this.mailSender.send(mimeMessage);
            status = HttpStatus.OK;
            log.info("EMAIL SENT SUCCESSFULLY");
        } catch (Exception ex) {
            log.info("FAILED TO SEND EMAIL " + ex.getMessage());
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        log.info("SEND FORGOT PASSWORD EMAIL () END");
        return new ResponseEntity<>(status);
    }

    public ResponseEntity<Object> sendEmailVerificationEmail(User user, Locale locale, String homeURL, String redirectURL, String code) throws MessagingException {
        log.info("SEND EMAIL VERIFICATION EMAIL () BEGIN -- {}", serverFrom);
        log.info("Locale Variable: {}, User: {} [{}], HomeURL: {}, RedirectURL: {}, Code: {}", locale, user, user.getEmail(), homeURL, redirectURL, code);

        final Context context                 = new Context(locale);
        final MimeMessage mimeMessage         = this.mailSender.createMimeMessage();
        final MimeMessageHelper messageHelper = new MimeMessageHelper(mimeMessage, "UTF-8");
        final String emailSubject             = "Verify your email";

        context.setVariable("homeURL", homeURL);
        context.setVariable("title", emailSubject);
        context.setVariable("firstName", user.getFirstName());
        context.setVariable("lastName", user.getLastName());
        context.setVariable("contentBody1", "In order to start using your RoboBurger account, please confirm your email address by clicking on the button below.");
        context.setVariable("redirectURL", (redirectURL + code));
        context.setVariable("buttonLabel", "Verify email address");
        context.setVariable("brand", "RoboBurger");

        messageHelper.setSubject(emailSubject);
        messageHelper.setFrom(serverFrom);
        messageHelper.setTo(user.getEmail()); 

        log.info("SET HTML CONTENT");
        final String htmlContent = this.htmlTemplateEngine.process("templates/email-verification", context);
        messageHelper.setText(htmlContent, true /* is HTML */);

        // SEND EMAIL
        HttpStatus status;
        try {
            log.info("SENDING EMAIL...");
            this.mailSender.send(mimeMessage);
            status = HttpStatus.OK;
            log.info("EMAIL SENT SUCCESSFULLY");
        } catch (Exception ex) {
            log.info("FAILED TO SEND EMAIL " + ex.getMessage());
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        log.info("SEND EMAIL VERIFICATION EMAIL () END");
        return new ResponseEntity<>(status);
    }

    public ResponseEntity<Object> sendReceiptEmail(User user, Locale locale, ReceiptDTO receipt) throws MessagingException, IOException, NullPointerException {
        log.info("SEND RECEIPT BEGIN -- {}", serverFrom);
        log.info("User email: {}", user.getEmail());
        log.info("User phone number", user.getPhoneNumber());


        final Context context                 = new Context(locale);
        final MimeMessage mimeMessage         = this.mailSender.createMimeMessage();
        final MimeMessageHelper messageHelper = new MimeMessageHelper(mimeMessage, "UTF-8");
        final String accountType              = receipt.getInvoicePdf().getPaymentInfo().getPiAccountType().replace("_", "");
        final String emailSubject             = "We've received your RoboBurger order!";
        final DecimalFormat df                = new DecimalFormat("0.00");
        
        String location    = receipt.getInvoicePdf().getTransaction().getVendingMachine().getLocation() + ", " + receipt.getInvoicePdf().getTransaction().getVendingMachine().getAddress() + ", " +receipt.getInvoicePdf().getTransaction().getVendingMachine().getCity();
        String orderNumber = String.format("%05d", receipt.getOrderId());
        String phoneNumber = receipt.getPhoneNumber();
        String paymentEmail= receipt.getPaymentEmail();
        String receiptUrl  = receipt.getInvoicePdf().getReceiptUrl();
        String redirectURL = receipt.getInvoicePdf().getRedirectUrl();
        String unsubscribeCode = " ";

        if (user.getEmail() != null) {
            unsubscribeCode = user.getSubscription().equalsIgnoreCase("ACT") ? verificationRepository.findUserCode(user.getUserId(), "ACT", "Unsubscribe Verification").get().getCode() : " ";
        } 

        receiptDetails = "";
        receipt.getInvoicePdf().getItems().stream().forEach(item -> {
            
            List<String> condimentList = new ArrayList<>(); 
            String condiment = "";
            
            if (item.getName().equalsIgnoreCase("custom")) {
                if (item.getCondimentOrder().size() > 0 ) {
                    for(CondimentOrderDTO condimentOrder : item.getCondimentOrder()) {               
                        condimentList.add(condimentOrder.getName());
                    }  
                    condiment = condimentList.toString();
                    condiment = condiment.replace("cheese", "Melty Cheese Sauce");
                    condiment = condiment.replace("[","(");
                    condiment = condiment.replace("]",")");
                }
                
            }
            
            receiptDetails = receiptDetails + addItem(item.getName(), item.getSubtotal(), item.getQuantity(), item.getDescription(), condiment);
        });
        
        context.setVariable("date1", receipt.getInvoicePdf().getTransactionDate());
        context.setVariable("title", emailSubject);
        context.setVariable("firstName", user.getFirstName());
        context.setVariable("lastName", user.getLastName());
        context.setVariable("orderNo", "#" + String.format("%05d", receipt.getOrderId()));
        context.setVariable("brand", "RoboBurger");
        context.setVariable("subtotal", receipt.getSubtotal());
        context.setVariable("htmlReceiptDetails", receiptDetails);
        context.setVariable("receiptTaxes", df.format(receipt.getFees()));
        context.setVariable("receiptSubTotal", df.format(receipt.getSubtotal()));
        context.setVariable("receiptTotal", df.format(receipt.getTotal()));
        context.setVariable("vendingMachineID", receipt.getInvoicePdf().getTransaction().getVendingMachine().getVendingMachineId());
        context.setVariable("location", receipt.getInvoicePdf().getTransaction().getVendingMachine().getLocation());
        context.setVariable("city", receipt.getInvoicePdf().getTransaction().getVendingMachine().getCity() + ",");
        context.setVariable("address", receipt.getInvoicePdf().getTransaction().getVendingMachine().getAddress());
        context.setVariable("imageholder", "https://i.postimg.cc/c4HNkdh9/Untitled-design-8.png");
        context.setVariable("postalCode", receipt.getInvoicePdf().getTransaction().getVendingMachine().getPostalCode());
        context.setVariable("redirectUrl", redirectURL + "/unsubscribe?code=" + unsubscribeCode);

        if (receipt.getInvoicePdf().getDiscount() != 0.0) {
            context.setVariable("receiptDiscount", addFinalItem(receipt.getInvoicePdf().getCoupon(), df.format(receipt.getInvoicePdf().getDiscount()))); 
            context.setVariable("receiptTotal", df.format(receipt.getTotal() - receipt.getInvoicePdf().getDiscount()));
        }

        if (receipt.getInvoicePdf().getPaymentInfo().getPiAccountType().equals("credit_card")) {
            context.setVariable("cardNum",receipt.getInvoicePdf().getPaymentInfo().getPiCreditCardNumber());
            context.setVariable("payPal", "https://i.postimg.cc/V6YDWpMp/HD-transparent-picture.png" );
        }
        else if (receipt.getInvoicePdf().getPaymentInfo().getPiAccountType().equals("paypal_account")) {
            context.setVariable("payPal", "https://roboburgerdev.blob.core.windows.net/email-templates/payment-paypal.png");
            context.setVariable("cardNum", " ");
            context.setVariable("accountType", " ");
        }
        else  {
            context.setVariable("payPal", "https://roboburgerdev.blob.core.windows.net/email-templates/payment-applepay.png");
            context.setVariable("cardNum", " ");
            context.setVariable("accountType", " ");
        }

        if (receipt.getInvoicePdf().getDiscount() != 0.0) {
            context.setVariable("discountHolder", "Promo Code");
            context.setVariable("discount", "-$" + df.format(receipt.getInvoicePdf().getDiscount())); 
        }

        if (accountType.equals("creditcard") ) {
            context.setVariable("accountType", " Credit Card");
        } else if  (accountType.equals("paypalaccount") ) {
            context.setVariable("accountType", " ");
        } else {
                context.setVariable("accountType", " ");
            }

        log.info("attachment: {}", receipt.getInvoicePdf());

        // SEND EMAIL
        HttpStatus status = null;
 
            try {

                if (paymentEmail != null && user.getEmailStatus().equalsIgnoreCase("ACT") && user.getSubscription().equalsIgnoreCase("ACT")) {
                    messageHelper.setSubject(emailSubject);
                    messageHelper.setFrom(serverFrom);
                    messageHelper.setTo(receipt.getPaymentEmail());

                    log.info("SET HTML CONTENT");
                    final String htmlContent = this.htmlTemplateEngine.process("templates/invoice", context);
                    messageHelper.setText(htmlContent, true /* is HTML */);

                    log.info("SENDING EMAIL...");
                    this.mailSender.send(mimeMessage);
                   
                    log.info("EMAIL SENT SUCCESSFULLY");
                } 

                if (phoneNumber != null && user.getPhoneNumberStatus().equals("ACT")) {
                    log.info("SENDING SMS...");
                    twilioService.sendReceiptSMS(orderNumber, location, phoneNumber, receiptUrl);
                }

                status = HttpStatus.OK;
                
            } catch (Exception ex) {
                log.info("FAILED TO SEND RECEIPT " + ex.getMessage());
                log.info("{}", ex);
                status = HttpStatus.INTERNAL_SERVER_ERROR;
            }

        log.info("SEND RECEIPT FINISHED");
        return new ResponseEntity<>(status); 
    }

    public String addItem(String product, Double price, Integer quantity, String description, String condiment) {
        StringBuilder item = new StringBuilder();

            if (product.equalsIgnoreCase("Standard")){
               item.append("<div style='display: flex; flex-direction: row; padding-top: 8px; padding-bottom: 8px;'>");
            } else {
                item.append("<div style='display: flex; flex-direction: row; padding-top: 8px; padding-bottom: 0px;'>");
            }

          
            item.append("<span style='width: 185px; margin: 0px;'>");
            item.append(product + " RoboBurger");
            item.append("</span>"); 
           
            item.append("<span style='width: 50px; text-align: right; margin: 0px;'>");
            item.append(quantity);
            item.append("</span>");
            item.append("<span style='width: 100px; text-align: right; padding-right: 5px; margin: 0px;'>");

            item.append("$" + price);
            item.append("</span>");
            item.append("</div>");

            if (product.equalsIgnoreCase("Custom")){
                item.append("<span style='width: 185px; margin-bottom: 0px; font-size: 12px; line-height: 22px; font-weight: bold; padding-top: 0px;'>");
                item.append(condiment);
                item.append("</span>");
            }

            return item.toString();
    }  

    public String addFinalItem(String discount, String price) {
        return new StringBuilder()
            .append("<div>")
            .append("<p'>")
            .append(discount)
            .append("</p>")
            .append("<p'> -")
            .append(price)
            .append(" USD </p>")
            .append("</div>")
        .toString();
    }
}
