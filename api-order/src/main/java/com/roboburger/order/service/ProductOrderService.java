package com.roboburger.order.service;

import java.util.*;
import java.util.function.Predicate;
import java.util.stream.Collectors;

import com.roboburger.core.dto.*;

import com.roboburger.core.enumerated.CartItemStatusEnum;
import com.roboburger.core.enumerated.ProductTypesEnum;
import com.roboburger.order.apiservice.ProductApiService;
import com.roboburger.order.apiservice.VendingMachineService;
import com.roboburger.order.entity.CondimentOrder;
import com.roboburger.order.entity.Order;
import com.roboburger.order.entity.ProductOrder;

import com.roboburger.order.mapper.ProductOrderMapper;
import com.roboburger.order.repository.OrderRepository;
import com.roboburger.order.repository.ProductOrderRepository;

import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class ProductOrderService {

    @Autowired
    private ProductApiService productApiService;

    @Autowired
    private CondimentOrderService condimentOrderService;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductOrderRepository productOrderRepository;

    @Autowired
    private VendingMachineService vmService;

    /**
     *
     * @param products
     * @param productId
     * @return
     */
    public Optional<ProductDTO> getProduct(List<ProductDTO> products, Integer productId) {
        return products.stream().filter(matchesProductId(productId)).findFirst();
    }

    /**
     *
     * @param productId
     * @return
     */
    public Predicate<ProductDTO> matchesProductId(Integer productId) {
        return item -> item.getProductId().equals(productId);
    }

    public boolean checkCondiments(ProductOrderDTO request, List<CondimentOrder> condimentOrders) {
        List<Integer> lastOrderCondiment = new ArrayList<>();
        for (CondimentOrder condimentOrder: condimentOrders) {
            lastOrderCondiment.add(condimentOrder.getOptionsTypeId());
        }
        
        List<Integer> requestOrderCondiment = new ArrayList<>();
        for (CondimentOrderDTO condimentOrder: request.getProductOrderCondiments()) {
            requestOrderCondiment.add(condimentOrder.getOptionsTypeId());
        }

        List<Integer> difference = new ArrayList<>(requestOrderCondiment);

        difference.removeAll(lastOrderCondiment);
        
        return lastOrderCondiment.size() == requestOrderCondiment.size() && difference.isEmpty();
    }

    public ProductOrder saveOrder(ProductOrderDTO request) {
        Integer orderId = request.getOrderId();
        Integer productId = request.getProductId();

        ProductOrder productOrder = new ProductOrder();
        
        Order order = orderRepository.findByOrderId(orderId).orElse(null);
        ProductOrder existingOrder = productOrderRepository.findByProductAndOrderID(orderId, productId).orElse(null);

        log.info("Existing Order: {}", existingOrder);

        if (order != null) {
            if (existingOrder != null) {
                log.info("checking condiments");
                boolean isSameCondiments = checkCondiments(request, existingOrder.getProductOrderCondiments());

                if (isSameCondiments) {
                    log.info("same condiments, updating previous order");
                    productOrder = updateOrderQuantity(request, existingOrder);
                } else {
                    log.info("creating new order");
                    productOrder = addOrder(request, order);
                }
            } else {
                productOrder = addOrder(request, order);
            }
        }

        return productOrder;
    }

    public ProductOrder updateOrderQuantity(ProductOrderDTO request, ProductOrder existingOrder) {

        if (request.getName().equals(ProductTypesEnum.STANDARD)) {
            log.info("saving standard burger", ProductTypesEnum.STANDARD.name());
            existingOrder.setQuantity(request.getQuantity());
        } else {
            log.info("saving customized burger", ProductTypesEnum.STANDARD.name());
            existingOrder.setQuantity(request.getQuantity() + existingOrder.getQuantity());
        }

        existingOrder.setVendingMachineId(request.getVendingMachineId());

        return  productOrderRepository.save(existingOrder);
    }

    public ProductOrder addOrder(ProductOrderDTO request, Order order) {
        ProductOrder productOrder;

        productOrder = ProductOrderMapper.INSTANCE.dtoToEntity(request);

        productOrder.setOrder(order);
        if (!productOrder.getProductOrderCondiments().isEmpty() || !request.getProductOrderCondiments().isEmpty()) {
            List<CondimentOrder> condimentOrders = new ArrayList<>();
            for (CondimentOrder condimentOrder : productOrder.getProductOrderCondiments()) {
                condimentOrder.setProductOrder(productOrder);
                condimentOrders.add(condimentOrder);
            }
            productOrder.setProductOrderCondiments(condimentOrders);
        }
        log.info("Saving Order: {}", productOrder);

        return productOrderRepository.save(productOrder);
    }

    public Order findByOrderId(Integer orderId) {

        return orderRepository.findByOrderId(orderId).orElse(null);
    }

    public ResponseEntity<ProductOrderDTO> findByProduct(Integer orderId, Integer productId) {
        ProductOrder productOrder = productOrderRepository.findByProductAndOrderID(orderId, productId).orElse(null);
        ProductOrderDTO productOrderDTO = ProductOrderMapper.INSTANCE.entityToDTO(productOrder);
        HttpStatus status;

        if (productOrder == null) {
            status = HttpStatus.NOT_FOUND;
        } else {
            status = HttpStatus.OK;
        }
        return new ResponseEntity<>(productOrderDTO, status);
    }

    /**
     *
     * @param entities
     * @param order
     * @return
     */
    public List<CartItemDTO> getCartItems (List<ProductOrder> entities, Optional<Order> order) {

        List<ProductDTO> vmProducts = productApiService.getProducts();
        List<ProductDTO> products = new ArrayList<>(vmProducts);

        return entities.stream().map(po -> {
            CartItemDTO ci = new CartItemDTO();

            if (order.isPresent()) {
                ci.setOrderId(order.get().getOrderId());
            } else {
                return ci;
            }

            VendingMachineDTO vmDto = vmService.findByUnitId(po.getVendingMachineId());

            ci.setProductId(po.getProductId());
            ci.setProductOrderId(po.getProductOrderId());
            ci.setVendingMachineId(po.getVendingMachineId());
            ci.setStatus(CartItemStatusEnum.AVAILABLE);
            ci.setCondimentOrder(condimentOrderService.condimentEntityToDto(po.getProductOrderCondiments()));
            ci.setVmLocation(vmDto.getLocation());
            ci.setVmAddress(vmDto.getAddress());
            ci.setVmCity(vmDto.getCity());

            Optional<ProductDTO> tmp = getProduct(products, po.getProductId());
            if (tmp.isEmpty()) {
                ci.setStatus(CartItemStatusEnum.UNAVAILABLE);
                ci.setPrice(0d);
                ci.setImage(null);
                ci.setTax(0d);
                ci.setSubtotal(0d);
                ci.setTotal(0d);
            } else {
                ci.setPrice(vmDto.getPrice());
                ci.setQuantity(po.getQuantity());
                ci.setTax(.1);
                ci.setSubtotal(po.getQuantity() * vmDto.getPrice());
                ci.setTotal(ci.getSubtotal() + (ci.getSubtotal() * ci.getTax()));
                ci.setName(tmp.get().getName());
                ci.setDescription(tmp.get().getDescription());
            }

           return ci;
        }).collect(Collectors.toList());
    }

    public void deleteOrders (List<ProductOrder> items) {
        productOrderRepository.deleteAll(items);
    }
}

