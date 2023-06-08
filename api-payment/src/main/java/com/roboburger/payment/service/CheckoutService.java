package com.roboburger.payment.service;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import com.braintreegateway.*;
import com.roboburger.core.dto.CartItemDTO;
import com.roboburger.core.dto.PaymentDTO;
import com.roboburger.core.dto.ProductDTO;
import com.roboburger.core.security.jwt.JWTUtil;
import com.roboburger.core.security.user.UserCredential;
import com.roboburger.core.enumerated.CartItemStatusEnum;

import com.roboburger.payment.PaymentApplication;
import com.roboburger.payment.apiservice.InventoryApiService;
import com.roboburger.payment.apiservice.OrderApiService;
import com.roboburger.payment.controller.request.CheckOutRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.ui.Model;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.beans.factory.annotation.Value;

import lombok.extern.slf4j.Slf4j;

import com.braintreegateway.Transaction.Status;

@Service
@Slf4j
public class CheckoutService {
    
    private String SECRET; 

    @Value("${api.secret}")
  	private void setJwtSecret(String jwtSecret) {
		SECRET = jwtSecret;
	}

    private final BraintreeGateway gateway = PaymentApplication.gateway;

    @Autowired
    private OrderApiService orderApiService;

    @Autowired
    private InventoryApiService inventoryApiService;

    @Autowired
    private ProductService productService;

    @Autowired
    private TransactionItemService transactionItemService;

    private final Status[] TRANSACTION_SUCCESS_STATUSES = new Status[] {
        Transaction.Status.AUTHORIZED,
        Transaction.Status.AUTHORIZING,
        Transaction.Status.SETTLED,
        Transaction.Status.SETTLEMENT_CONFIRMED,
        Transaction.Status.SETTLEMENT_PENDING,
        Transaction.Status.SETTLING,
        Transaction.Status.SUBMITTED_FOR_SETTLEMENT
     };


    /**
     * 
     * @param amount
     * @param nonce
     * @param redirectAttributes
     * @return
     */
    public ResponseEntity<Object> checkout (Double amount, String nonce, 
                                            final RedirectAttributes redirectAttributes
                                            ) {
        PaymentDTO paymentDTO = new PaymentDTO();
        BigDecimal decimalAmount;
        
        try {
            decimalAmount = BigDecimal.valueOf(amount);
        } catch (NumberFormatException e) {
            redirectAttributes.addFlashAttribute("errorDetails", "Error: 81503: Amount is an invalid format.");

            /** return "redirect:checkouts"; */ 
            return new ResponseEntity<>(redirectAttributes, HttpStatus.BAD_REQUEST);
        }

        TransactionRequest request = new TransactionRequest()
            .amount(decimalAmount)
            .paymentMethodNonce(nonce)
            .options()
                .submitForSettlement(true)
                .done();

        Result<Transaction> result = gateway.transaction().sale(request);

        if (result.isSuccess()) {
            Transaction transaction = result.getTarget();
            log.info("transaction success: {}, {}, {}", transaction.getId(), 
                                                                transaction.getStatus(), 
                                                                transaction.getAmount());

            /** return "redirect:checkouts/" + transaction.getId(); */
            /** JSONObject responseJsonObject = new JSONObject();*/ 
            CreditCard creditCard;
            Customer customer;
            
            paymentDTO.setPiAccountType(transaction.getPaymentInstrumentType());
            paymentDTO.setPiCardType(transaction.getCreditCard().getCardType());
            paymentDTO.setPiExpirationDate(transaction.getCreditCard().getExpirationDate());
            paymentDTO.setPiPaymenType(transaction.getCreditCard().getAccountType());
            paymentDTO.setPiCountryIssuance(transaction.getCreditCard().getCountryOfIssuance()); 

            paymentDTO.setTiAmount(transaction.getAmount() + "");

            try {
                transaction = gateway.transaction().find(transaction.getId());
                creditCard = transaction.getCreditCard();
                customer = transaction.getCustomer();
            } catch (Exception e) {
                e.printStackTrace();
                log.info("redirect:/checkouts");
                return null;
            }
            
            String securedMaskedNumber = "";

            if ((transaction.getCreditCard().getCardType()).equals("Discover")) {
                if ((creditCard.getMaskedNumber().charAt(0) == '6')) {
                    securedMaskedNumber = "****-****-****-" + (creditCard.getMaskedNumber().substring(creditCard.getMaskedNumber().length() - 4));
                } else {
                    securedMaskedNumber = "****-******-" + (creditCard.getMaskedNumber().substring(creditCard.getMaskedNumber().length() - 4));
                }
            } else if ((transaction.getCreditCard().getCardType()).equals("American Express")) {
                    securedMaskedNumber = "****-******-*" + (creditCard.getMaskedNumber().substring(creditCard.getMaskedNumber().length() - 4));
            } else {
                    securedMaskedNumber = "****-****-****-" + (creditCard.getMaskedNumber().substring(creditCard.getMaskedNumber().length() - 4));
            }

            paymentDTO.setPiCardholderName(transaction.getCreditCard().getCardholderName());
            paymentDTO.setPiCreditCardNumber(securedMaskedNumber);
            paymentDTO.setTiMerchantAccount(transaction.getMerchantAccountId());
            paymentDTO.setTiTransactionType(transaction.getType() + "");
            
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-mm-dd hh:mm:ss");
	        String createdAt = sdf.format(transaction.getCreatedAt().getTime());

            paymentDTO.setTiTransactionDate((int)transaction.getCreatedAt().toInstant().getEpochSecond());
            paymentDTO.setTiStatus(transaction.getStatus() + "");
            paymentDTO.setTiSettlementBatch(transaction.getSettlementBatchId());
            paymentDTO.setTiProcessorAuthorizationCode(transaction.getProcessorAuthorizationCode());

            // send
            return new ResponseEntity<>(paymentDTO, HttpStatus.OK);

        } else if (result.getTransaction() != null) {
            Transaction transaction = result.getTransaction();
            log.info("transaction !success: {}", transaction);

            /** return "redirect:checkouts/" + transaction.getId(); */
            return new ResponseEntity<>(transaction, HttpStatus.OK);

        } else {
            StringBuilder errorString = new StringBuilder();
            for (ValidationError error : result.getErrors().getAllDeepValidationErrors()) {
               errorString.append("Error: ").append(error.getCode()).append(": ").append(error.getMessage()).append("\n");
            }
            redirectAttributes.addFlashAttribute("errorDetails", errorString.toString());
            log.info("redirect attribs: {}", redirectAttributes);

            /** return "redirect:checkouts"; */
            return new ResponseEntity<>(redirectAttributes, HttpStatus.BAD_REQUEST);
        }
    }

    public Model getTransactionById (String transactionId, Model model) {

        Transaction transaction;
        CreditCard creditCard;
        Customer customer;

        try {
            transaction = gateway.transaction().find(transactionId);
            creditCard = transaction.getCreditCard();
            customer = transaction.getCustomer();
        } catch (Exception e) {
            System.out.println("Exception: " + e);
            log.info("redirect:/checkouts");
            return null;
        }

        model.addAttribute("isSuccess", Arrays.asList(TRANSACTION_SUCCESS_STATUSES).contains(transaction.getStatus()));
        model.addAttribute("transaction", transaction);
        model.addAttribute("creditCard", creditCard);
        model.addAttribute("customer", customer);

        log.info("model/ transaction -- {}", model);

        /** return "checkouts/show";*/
        return model;
    }

    /**
     * This whole process should replace by SAGA orchestration pattern
     * Steps:
     * 1. Check Inventory
     * 2. Save Transaction
     * 3. Save Transaction_Item
     * 4. Update Inventory (Should be added at MVP 2)
     * 5. Perform Payment
     * 6. Save Payment information
     * 7. Update Order status to completed
     * 
     * */
    public ResponseEntity<Object> transactionCheckout (String token, CheckOutRequest req) {
        String                qrCode    = "";
        UserCredential        uc        = JWTUtil.parseToken(token.substring(7, token.length()), SECRET);
        List<CartItemDTO>     cartItems = orderApiService.getCartItems(token, uc.getUserId());
        Optional<CartItemDTO> cartItem  = cartItems.stream().findFirst();

        /** Step 1 - Check inventory */
        if (cartItem.isPresent()) {
            List<ProductDTO> stocks     = inventoryApiService.getProducts(cartItem.get().getVendingMachineId());
            List<ProductDTO> purchases  = new ArrayList<>();
            int              ctr        = 0;

            for (CartItemDTO ci : cartItems) {
                Optional<ProductDTO> optProduct = productService.getProduct(stocks, ci.getProductId());
                ProductDTO           product    = new ProductDTO();

                if (optProduct.isPresent()) {
                    product = optProduct.get();
                } else {
                    ci.setStatus(CartItemStatusEnum.UNAVAILABLE);
                    ctr++;
                }

                ProductDTO purchaseItem = new ProductDTO();

                purchaseItem.setProductId(product.getProductId());
                purchaseItem.setQuantity(ci.getQuantity());
                purchases.add(purchaseItem);
            }

            if (ctr > 0) {
                return new ResponseEntity<>(cartItems, HttpStatus.BAD_REQUEST);
            }
            
        }

        /** Steps 2 - 7 */
        transactionItemService.savePaymentTransaction(cartItems, req, qrCode, uc, qrCode);
        
        return new ResponseEntity<>(HttpStatus.OK);
    }
    
}