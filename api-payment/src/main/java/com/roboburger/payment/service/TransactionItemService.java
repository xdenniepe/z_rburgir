package com.roboburger.payment.service;

import java.util.*;
import java.util.function.Predicate;
import java.util.stream.Collectors;

import com.roboburger.core.dto.*;
import com.roboburger.core.security.user.UserCredential;
import com.roboburger.core.utility.Utility;
import com.roboburger.payment.apiservice.InventoryApiService;
import com.roboburger.payment.apiservice.OrderApiService;
import com.roboburger.payment.apiservice.PaymentApiService;
import com.roboburger.payment.apiservice.VendingMachineService;
import com.roboburger.payment.controller.request.CheckOutRequest;
import com.roboburger.payment.entity.Payment;
import com.roboburger.payment.entity.Transaction;
import com.roboburger.payment.entity.TransactionItem;
import com.roboburger.payment.mapper.HibernateFieldMapper;
import com.roboburger.payment.repository.PaymentRepository;
import com.roboburger.payment.repository.TransactionItemRepository;
import com.roboburger.payment.repository.TransactionRepository;

import lombok.extern.slf4j.Slf4j;
import org.dozer.DozerBeanMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import org.springframework.http.MediaType;

@Service
@Slf4j
public class TransactionItemService {

    @Autowired
    private TransactionItemRepository transactionItemRepo;

    @Autowired
    private CouponService couponService;

    @Autowired
    private TransactionRepository transactionRepo;

    @Autowired
    private PaymentApiService paymentApiService;

    private DozerBeanMapper dozer;

    @Autowired
    private PaymentRepository paymentRepo;

    @Autowired
    private OrderApiService orderApiService;

    @Autowired
    private WebClient userClient;

    @Autowired
    private VendingMachineService vmService;

    @Autowired
    private InventoryApiService inventoryApiService;

    @Autowired
    public TransactionItemService() {
        this.dozer  = new DozerBeanMapper();
        this.dozer.setCustomFieldMapper( new HibernateFieldMapper());
    }

    public Optional<CondimentOrderDTO> checkCondiments(List<CondimentOrderDTO> condiment, String name) {
        return condiment.stream().filter(matchesCondiment(name)).findFirst();
    }

    public Predicate<CondimentOrderDTO> matchesCondiment(String name) {
        return item -> item.getName().equals(name);
    }

    public String generateQr(List<CondimentOrderDTO> condimentOrder) {
        StringBuilder qrCode = new StringBuilder(100);

        List<String> condimentCheckList = Arrays.asList("ketchup", "mustard", "cheese", "bbq", "relish", "robo magic sauce");

        qrCode.append("AP");

        for (String condimentName : condimentCheckList) {
            String hasCondiment = "";
            for(CondimentOrderDTO co : condimentOrder) {
                if (hasCondiment.equals("")) {
                    hasCondiment = checkCondiments(condimentOrder, condimentName).isPresent() ? "1" : "0";
                }
            }
            qrCode.append(hasCondiment);
        }

        qrCode.append(Utility.generateUUID().replace("-", "").substring(16));

        return String.valueOf(qrCode);
    }


    public List<TransactionItem> cartItemsToTransactionItems(List<CartItemDTO> cartItems, int userId, Transaction transaction) {

        List<TransactionItem> transactionItems = new ArrayList<>();

        List<TransactionItem> items = cartItems.stream().map(i -> {

            List<CondimentOrderDTO> condimentOrders = new ArrayList<>(i.getCondimentOrder());
           
            TransactionItem tmp = new TransactionItem();

            for (int t = 0;t < i.getQuantity(); t++) {
                TransactionItem tItem = new TransactionItem();

                String qrCode = generateQr(condimentOrders);

                tItem.setProductId(i.getProductId());
                tItem.setItemDescription(i.getDescription());
                tItem.setCode(String.valueOf(qrCode));
                tItem.setItemPrice(i.getPrice());
                tItem.setItemTax(i.getTax());
                tItem.setItemTotalCost(i.getTotal());
                tItem.setTransaction(transaction);
                tItem.setWhoAdded(userId);
                tItem.setWhenAdded( (int) (new Date().getTime()/ 1000));

                transactionItems.add(tItem);
            }

            return tmp;
        }).collect(Collectors.toList());

        return transactionItems;
    }

    public List<TransactionItemDTO> convertTransactionItemstoDTO(List<TransactionItem> transactionItems) {

        List<TransactionItemDTO> transactionItemDTOs = new ArrayList<>();

        for (TransactionItem transactionItem: transactionItems) {
            TransactionItemDTO item = new TransactionItemDTO();
            dozer.map(transactionItem, item);
            transactionItemDTOs.add(item);
        }

        return transactionItemDTOs;

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
     * @param cartItems
     * @param req
     * @param qrCode
     * @param uc
     * @param token
     * @return
     */

    public ResponseEntity<Object> savePaymentTransaction (List<CartItemDTO> cartItems,
                                                         CheckOutRequest req, String qrCode, UserCredential uc,
                                                         String token) {
                                                            
        Transaction transaction          = new Transaction();
        CouponDTO coupon                 = couponService.checkCoupon(req.getCouponCode());

        log.info("Coupon code: {}", coupon);

        // Step 2 - Save Transaction
        transaction.setOrderId(req.getOrderId());
        transaction.setUserId(uc.getUserId());
        transaction.setWhoAdded(uc.getUserId());
        transaction.setWhenAdded( (int) (new Date().getTime()/ 1000));

        if (coupon != null){
            transaction.setCouponId(coupon.getCouponId());
        }

        // Step 3 - Save Transaction Item
        List<TransactionItem> transactionItems = cartItemsToTransactionItems(cartItems, uc.getUserId(), transaction);

        double transactionCost = 0.00;

        for (TransactionItem transactionItem : transactionItems) {
            transactionCost = transactionCost + transactionItem.getItemTotalCost();
        }

        transaction.setTotalCost(Utility.formatDouble(transactionCost, 2));

        transactionRepo.save(transaction);

        transactionItemRepo.saveAll(transactionItems);

        // Step 5 - Perform Payment
        Double      total       = couponService.applyCoupon(coupon, transactionItems.stream().map(TransactionItem::getItemTotalCost).reduce(0d, Double::sum));
        PaymentDTO  paymentDTO  = paymentApiService.createOrder(token, total, req.getPaymentMethod());

        // Step 6 - Save payment info
        Payment     payment     = new Payment();
        
        dozer.map(paymentDTO, payment);
        payment.setTransaction(transaction);
        paymentRepo.save(payment);

        List<CouponDTO> coupons = inventoryApiService.savePromoCodes(convertTransactionItemstoDTO(transactionItems), token);
        
        // Step 7 - Update order status to completed
        if (!coupons.isEmpty()) {
            orderApiService.updateOrder(token, req.getOrderId());
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        
        return new ResponseEntity<>(HttpStatus.OK);
    }

    /**
     * 
     * @param token
     * @param req
     * @return
     */
    public ResponseEntity<Object> transactionReceipt (String token, CheckOutRequest req) {

        Optional<Transaction> transaction       = transactionRepo.findByOrderId(req.getOrderId());
        Payment               payment           = paymentRepo.findByTransactionId(transaction.get().getTransactionId());
        PaymentDTO            paymentDTO        = new PaymentDTO();
        TransactionDTO        transactionDTO    = findByOrderId(transaction.get().getOrderId());
        // get the coupon used in transaction
        CouponDTO             couponResponse    = getTransactionCoupon(transaction);
        // get discount
        Double                discount          = getTransactionDiscount(couponResponse, transaction);

        if (transaction.isPresent()) {

            // dozer.map(transaction.get(), transactionDTO);
            dozer.map(payment, paymentDTO);

            // invoice PDF
            InvoicePdfDTO  invoicePdf = createPdf(transactionDTO, req, paymentDTO, discount);
            // receipt
            ReceiptDTO receipt = createReceipt(req, invoicePdf);
            // send email receipt
            ReceiptDTO sendEmail = userClient.post().uri(uriBuilder -> uriBuilder.path("/api/users/receipt").build())
                                                    .contentType(MediaType.APPLICATION_JSON)
                                                    .header(HttpHeaders.AUTHORIZATION, token)
                                                    .bodyValue(receipt)
                                                    .retrieve().bodyToMono(ReceiptDTO.class).block();

            return new ResponseEntity<>(sendEmail, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * 
     * @param transactionDTO
     * @param req
     * @param paymentDTO
     * @param discount
     * @return
     */
    public InvoicePdfDTO createPdf (TransactionDTO transactionDTO, CheckOutRequest req, 
                                    PaymentDTO paymentDTO, Double discount) {

        List<CartItemDTO> cartItemDTOs = new ArrayList<>();
        InvoicePdfDTO  invoicePdf      = new InvoicePdfDTO();

        cartItemDTOs = req.getInvoicePdf().getItems();
        invoicePdf.setItems(cartItemDTOs);
        invoicePdf.setPaymentInfo(paymentDTO);
        invoicePdf.setTransaction(transactionDTO);
        invoicePdf.setItems(req.getInvoicePdf().getItems());
        invoicePdf.setDiscount(discount);
        invoicePdf.setCoupon(req.getInvoicePdf().getCoupon());
        invoicePdf.setTransactionDate(req.getInvoicePdf().getTransactionDate());
        invoicePdf.setCardNum(req.getInvoicePdf().getCardNum());
        invoicePdf.setReceiptUrl(req.getInvoicePdf().getReceiptUrl());
        invoicePdf.setPostal(req.getInvoicePdf().getPostal());
        invoicePdf.setRedirectUrl(req.getInvoicePdf().getRedirectUrl());

        return invoicePdf;
    }

    /**
     * 
     * @param req
     * @param invoicePdf
     * @return
     */
    public ReceiptDTO createReceipt (CheckOutRequest req, InvoicePdfDTO invoicePdf) {

        Optional<Transaction> transaction    = transactionRepo.findByOrderId(req.getOrderId());
        ReceiptDTO            receipt        = new ReceiptDTO();
        // receipt
        if (transaction.isPresent()) {
            receipt.setPaymentEmail(req.getPaymentEmail());
            receipt.setPhoneNumber(req.getPhoneNumber());
            receipt.setOrderId(transaction.get().getOrderId());
            receipt.setUserId(transaction.get().getUserId());
            receipt.setSubtotal(transaction.get().getSubtotal());
            receipt.setFees(transaction.get().getFees());
            receipt.setTotal(transaction.get().getTotal());
            receipt.setInvoicePdf(invoicePdf);
        }

        return receipt;
    }
    
    /**
     * 
     * @param transaction
     * @return
     */
    public CouponDTO getTransactionCoupon (Optional<Transaction> transaction) {
        CouponDTO couponResponse = new CouponDTO();

        if (transaction.isPresent() && transaction.get().getCouponId() != null) {
            couponResponse = couponService.getCouponById(transaction.get().getCouponId()); // coupon code functionality
        }

        return couponResponse;
    }

    /**
     * 
     * @param couponResponse
     * @param transaction
     * @return
     */
    public Double getTransactionDiscount (CouponDTO couponResponse, Optional<Transaction> transaction) {
        Double discount = 0.00;

        if (transaction.isPresent() && transaction.get().getCouponId() != null) {
            Double         trTotal         = transaction.get().getTotal();
            Double couponPercentage = ((double) couponResponse.getDiscountPercentage() / 100);
            discount = trTotal * couponPercentage;
        }

        return discount;
    }

    public TransactionDTO findByOrderId (Integer orderId) {

        Transaction transaction = transactionRepo.findTransactionByOrderId(orderId).orElse(null);
        TransactionDTO transactionDTO = new TransactionDTO();
        List<CartItemDTO> cartItems = orderApiService.findByOrderId(orderId);
        VendingMachineDTO vendingMachine = vmService.findByUnitId(cartItems.get(0).getVendingMachineId());

        if (transaction != null) {
            dozer.map(transaction, transactionDTO);
            transactionDTO.setVendingMachine(vendingMachine);

            List<TransactionItemDTO> items = new ArrayList<>();

            transaction.getTransactionItems().stream().map(transactionItem -> {
                TransactionItemDTO item = new TransactionItemDTO();
                dozer.map(transactionItem, item);
                ProductDTO product = inventoryApiService.findProductById(transactionItem.getProductId());
                item.setProductName(product.getName());
                item.setCode(transactionItem.getCode());

                CouponDTO couponCode = inventoryApiService.getCoupon(transactionItem.getCode());
              
                item.setActive(couponCode != null);
                items.add(item);

                return item;
            }).collect(Collectors.toList());

            transactionDTO.setTransactionItems(items);
        }

        return transactionDTO;

    }

        /**
     *
     * @param products
     * @param productId
     * @return
     */
    public Boolean checkCouponCode(List<TransactionItem> transactionItems, List<CouponDTO> couponCodes) {
        
        for (CouponDTO coupon : couponCodes) {
            Boolean isValid = transactionItems.stream().anyMatch(t -> 
                Objects.equals(t.getCode(), coupon.getCouponCode())
            );   

            if (Boolean.TRUE.equals(isValid)) {
                return true;
            }
        }
       
        return false;
    }

    /**
     * 
     * @param userId
     * @param token
     * @return
     */
    public TransactionHistoryDTO findUserOrderHistory (Integer userId, String token) {

        TransactionHistoryDTO history = new TransactionHistoryDTO(); // transaction history
        List<TransactionDTO> transactionDTO = new ArrayList<>(); // user transactions
        List<String> qrCodes = transactionItemRepo.findByOrderId(userId); // userQR codes
        List<Transaction> transaction = transactionRepo.findByUserId(userId); 
        List<CouponDTO> couponCodes = inventoryApiService.getCoupons(qrCodes, token); // QR Codes from RB DB

        List<TransactionHistoryItemDTO> activeOrders = new ArrayList<>();
        List<TransactionHistoryItemDTO> pastOrders = new ArrayList<>();
       
        dozer.map(transaction, transactionDTO);

        for (Transaction t : transaction) {
            TransactionHistoryItemDTO tItemDTO = new TransactionHistoryItemDTO();
            List<CartItemDTO> cartItems = orderApiService.findByOrderId(t.getOrderId());

            tItemDTO.setOrderId(t.getOrderId());
            tItemDTO.setUserId(t.getUserId());
            tItemDTO.setTransactionDate(t.getTimestamp().toString());
            tItemDTO.setCartItems(cartItems);

            Boolean isActive = checkCouponCode(t.getTransactionItems(), couponCodes);
            
            if (Boolean.TRUE.equals(isActive)) {
                activeOrders.add(tItemDTO);
            } else {
                pastOrders.add(tItemDTO);
            }
        }

        history.setActiveOrders(activeOrders);
        history.setPastOrders(pastOrders);

        return history;
    }
}
