package com.handloom.marketplace.controller;

import com.handloom.marketplace.dto.ApiDtos;
import com.handloom.marketplace.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public List<ApiDtos.OrderResponse> getAllOrders() {
        return orderService.getAllOrders();
    }

    @GetMapping("/buyer/{buyerId}")
    public List<ApiDtos.OrderResponse> getBuyerOrders(@PathVariable String buyerId) {
        return orderService.getBuyerOrders(buyerId);
    }

    @GetMapping("/artisan/{artisanId}")
    public List<ApiDtos.OrderResponse> getArtisanOrders(@PathVariable String artisanId) {
        return orderService.getArtisanOrders(artisanId);
    }

    @PostMapping("/checkout")
    public ApiDtos.OrderActionResponse checkout(@Valid @RequestBody ApiDtos.CheckoutRequest request) {
        return orderService.checkout(request);
    }

    @PatchMapping("/{orderId}/status")
    public ApiDtos.MessageResponse updateStatus(@PathVariable String orderId, @Valid @RequestBody ApiDtos.OrderStatusUpdateRequest request) {
        return orderService.updateStatus(orderId, request);
    }
}
