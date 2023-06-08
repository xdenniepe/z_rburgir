package com.roboburger.order.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import javax.transaction.Transactional;

import com.roboburger.core.dto.CartItemDTO;
import com.roboburger.core.dto.ProductOrderDTO;
import com.roboburger.order.entity.Order;
import com.roboburger.order.entity.ProductOrder;
import com.roboburger.order.repository.OrderRepository;
import com.roboburger.order.repository.ProductOrderRepository;
import com.roboburger.order.service.ProductOrderService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CartController {

    @Autowired
    private ProductOrderService productOrderService;


    @Autowired 
    private OrderRepository orderRepo;

    @Autowired
    private ProductOrderRepository poRepo;

    
    @GetMapping("/api/cart/items")
    @Transactional
    public ResponseEntity<Object> getCart(@RequestParam("userId") int userId) {
        Optional<Order> order = orderRepo.findByUserId(userId);
        if (order.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        List<ProductOrder> entities = poRepo.findByOrderId(order.get().getOrderId());
        if (entities.isEmpty()) {
            return new ResponseEntity<>(new ArrayList<>(), HttpStatus.OK);
        }

        List<CartItemDTO> cartItems = productOrderService.getCartItems(entities, order);

        return new ResponseEntity<>(cartItems, HttpStatus.OK);
    }

    @GetMapping("/api/cart/items/findByOrderId")
    @Transactional
    public ResponseEntity<Object> getCartByOrderId(@RequestParam("orderId") int orderId) {
        Optional<Order> order = orderRepo.findByOrderId(orderId);
        if (order.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        List<ProductOrder> entities = poRepo.findByOrderId(orderId);

        if (entities.isEmpty()) {
            return new ResponseEntity<>(new ArrayList<>(), HttpStatus.OK);
        }

        List<CartItemDTO> cartItems = productOrderService.getCartItems(entities, order);

        return new ResponseEntity<>(cartItems, HttpStatus.OK);
    }

    @GetMapping("/api/cart/items/findLatestOrder")
    @Transactional
    public ResponseEntity<Object> getLastOrder(@RequestParam("userId") Integer userId) {
        Optional<Order> order = orderRepo.findLastOrder(userId);
        if (order.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        List<ProductOrder> entities = poRepo.findByOrderId(order.get().getOrderId());

        if (entities.isEmpty()) {
            return new ResponseEntity<>(new ArrayList<>(), HttpStatus.OK);
        }

        List<CartItemDTO> cartItems = productOrderService.getCartItems(entities, order);

        return new ResponseEntity<>(cartItems, HttpStatus.OK);
    }

    @PostMapping("/api/productOrder/addOrder")
    @Transactional
    public ResponseEntity<ProductOrder> addOrder(@RequestBody ProductOrderDTO productOrder) {
        return ResponseEntity.ok(productOrderService.saveOrder(productOrder));
    }

    @DeleteMapping(value = "/api/productOrder/deleteOrder/{orderId}")
    public ResponseEntity<HttpStatus> deleteOrders(@PathVariable Integer orderId) {

        Order order = productOrderService.findByOrderId(orderId);
        List <ProductOrder> items;
        items = order.getProductOrders();

        if (items.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } 

        productOrderService.deleteOrders(items);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/api/productOrder")
    @Transactional
    public ResponseEntity<Order> getOrder(@RequestParam("orderId") Integer orderId) {

        return ResponseEntity.ok(productOrderService.findByOrderId(orderId));
    }

    @GetMapping("/api/productOrder/findByProductAndOrderID")
    public ResponseEntity<ProductOrderDTO> getOrderByProduct(@RequestParam("orderId") Integer orderId, @RequestParam("productId") Integer productId) {

        return productOrderService.findByProduct(orderId, productId);
    }
    
}
