package com.roboburger.payment.controller;

import java.io.IOException;

import javax.transaction.Transactional;

import com.roboburger.core.dto.TransactionDTO;
import com.roboburger.core.dto.TransactionHistoryDTO;
import com.roboburger.payment.controller.request.CheckOutRequest;
import com.roboburger.payment.service.CheckoutService;
import com.roboburger.payment.service.TransactionItemService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.extern.log4j.Log4j2;

@RestController
@RepositoryRestController
@Log4j2
public class TransactionController {

    @Autowired
    private CheckoutService checkoutService;

    @Autowired
    private TransactionItemService transactionItemService;

    /**
     * braintree_transaction_id
     * @return
     * @throws IOException
     * @throws NotFoundException
     */
    @PostMapping("/api/transactions/checkout")
    @Transactional
    public ResponseEntity<Object> checkout(@RequestHeader("Authorization") String token, @RequestBody CheckOutRequest req) throws IOException, NotFoundException {
        log.info("TransactionController.checkout begin()");
        ResponseEntity<Object> transactionCheckout = checkoutService.transactionCheckout(token, req);
        return transactionCheckout;
    }

    /**
     * 
     * @param token
     * @return
     * @throws IOException
     * @throws NotFoundException
     */
    @PostMapping("/api/transactions/receipt")
    public ResponseEntity<Object> sendReceipt(@RequestHeader("Authorization") String token, @RequestBody CheckOutRequest req) throws IOException, NotFoundException {
            ResponseEntity<Object> sendEmail = transactionItemService.transactionReceipt(token, req);
            return sendEmail;
    }

    @GetMapping("/api/transactions/findByOrderId")
    @Transactional
    public ResponseEntity<TransactionDTO> findByOrderId(@RequestParam("orderId") Integer orderId) {
        TransactionDTO transactionDTO = transactionItemService.findByOrderId(orderId);

        return new ResponseEntity<>(transactionDTO, HttpStatus.OK);
    }

    @GetMapping("/api/transactions/history")
    public ResponseEntity<TransactionHistoryDTO> findUserOrderHistory(@RequestHeader("Authorization") String token, @RequestParam("userId") Integer userId) {

        TransactionHistoryDTO history = transactionItemService.findUserOrderHistory(userId, token);

        return ResponseEntity.ok(history);
    }
    
}
