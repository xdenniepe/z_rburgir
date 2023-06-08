package com.roboburger.payment.controller;

import com.braintreegateway.*;
import com.roboburger.payment.PaymentApplication;
import com.roboburger.payment.service.CheckoutService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@RestController
@RequestMapping(path = "/api/braintree")
public class CheckoutController {
    private final BraintreeGateway gateway = PaymentApplication.gateway;

     @Autowired
     private CheckoutService checkoutService;

     @GetMapping("/")
    public String root(Model model) {
        return "redirect:checkouts";
    }

    @GetMapping("/checkouts")
    public String checkout(Model model) {
        String clientToken = gateway.clientToken().generate();
        model.addAttribute("clientToken", clientToken);

        return "checkouts/new";
    }

    // Receive a payment method nonce from your client
    // Create a transaction
    @PostMapping("/checkouts")
    public ResponseEntity<Object> postForm(@RequestParam("amount") Double amount, @RequestParam("payment_method_nonce") String nonce, Model model, final RedirectAttributes redirectAttributes) {
        return checkoutService.checkout(amount, nonce, redirectAttributes);
    }

    // @GetMapping("/checkouts/{transactionId}")
    public Model getTransaction(@PathVariable String transactionId, Model model) {
        return checkoutService.getTransactionById(transactionId, model);
    }
}
