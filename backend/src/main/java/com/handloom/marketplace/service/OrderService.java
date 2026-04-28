package com.handloom.marketplace.service;

import com.handloom.marketplace.dto.ApiDtos;
import com.handloom.marketplace.model.MarketplaceOrder;
import com.handloom.marketplace.model.OrderItem;
import com.handloom.marketplace.model.OrderStatus;
import com.handloom.marketplace.model.Product;
import com.handloom.marketplace.model.ProductStatus;
import com.handloom.marketplace.model.UserAccount;
import com.handloom.marketplace.model.UserRole;
import com.handloom.marketplace.repository.MarketplaceOrderRepository;
import com.handloom.marketplace.repository.ProductRepository;
import com.handloom.marketplace.repository.UserAccountRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class OrderService {

    private static final BigDecimal FREE_SHIPPING_THRESHOLD = BigDecimal.valueOf(5000);
    private static final BigDecimal SHIPPING_COST = BigDecimal.valueOf(250);

    private final MarketplaceOrderRepository marketplaceOrderRepository;
    private final UserAccountRepository userAccountRepository;
    private final ProductRepository productRepository;
    private final IdGenerationService idGenerationService;

    public OrderService(
            MarketplaceOrderRepository marketplaceOrderRepository,
            UserAccountRepository userAccountRepository,
            ProductRepository productRepository,
            IdGenerationService idGenerationService
    ) {
        this.marketplaceOrderRepository = marketplaceOrderRepository;
        this.userAccountRepository = userAccountRepository;
        this.productRepository = productRepository;
        this.idGenerationService = idGenerationService;
    }

    @Transactional(readOnly = true)
    public List<ApiDtos.OrderResponse> getBuyerOrders(String buyerId) {
        return marketplaceOrderRepository.findByBuyer_IdOrderByCreatedAtDesc(buyerId)
                .stream()
                .map(ApiMapper::toOrderResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ApiDtos.OrderResponse> getArtisanOrders(String artisanId) {
        return marketplaceOrderRepository.findArtisanOrders(artisanId)
                .stream()
                .map(ApiMapper::toOrderResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ApiDtos.OrderResponse> getAllOrders() {
        return marketplaceOrderRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(ApiMapper::toOrderResponse)
                .toList();
    }

    @Transactional
    public ApiDtos.OrderActionResponse checkout(ApiDtos.CheckoutRequest request) {
        UserAccount buyer = userAccountRepository.findById(request.buyerId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Buyer not found."));

        if (buyer.getRole() != UserRole.BUYER) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only buyer accounts can place marketplace orders.");
        }

        List<Long> productIds = request.items().stream().map(ApiDtos.CheckoutItemRequest::productId).toList();
        List<Product> products = productRepository.findAllById(productIds);
        Map<Long, Product> productMap = new HashMap<>();
        products.forEach(product -> productMap.put(product.getId(), product));

        if (products.size() != productIds.stream().distinct().count()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "One or more products in the checkout request do not exist.");
        }

        BigDecimal subtotal = BigDecimal.ZERO;
        MarketplaceOrder order = new MarketplaceOrder(
                idGenerationService.nextOrderId(marketplaceOrderRepository.findAll().stream().map(MarketplaceOrder::getId).toList()),
                buyer,
                buyer.getName(),
                Instant.now(),
                OrderStatus.PROCESSING,
                BigDecimal.ZERO,
                BigDecimal.ZERO,
                BigDecimal.ZERO
        );

        for (ApiDtos.CheckoutItemRequest itemRequest : request.items()) {
            Product product = productMap.get(itemRequest.productId());

            if (product.getStatus() != ProductStatus.ACTIVE || product.getStock() <= 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, product.getName() + " is not available for purchase.");
            }

            if (product.getStock() < itemRequest.quantity()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, product.getName() + " does not have enough stock for this order.");
            }

            subtotal = subtotal.add(product.getPrice().multiply(BigDecimal.valueOf(itemRequest.quantity())));
            order.addItem(new OrderItem(
                    product.getId(),
                    product.getName(),
                    product.getPrice(),
                    itemRequest.quantity(),
                    product.getRegion(),
                    product.getArtisan().getName(),
                    product.getArtisan().getId(),
                    product.getImage()
            ));

            int nextStock = product.getStock() - itemRequest.quantity();
            product.setStock(nextStock);
            if (nextStock == 0) {
                product.setStatus(ProductStatus.PAUSED);
            }
        }

        BigDecimal shipping = subtotal.compareTo(FREE_SHIPPING_THRESHOLD) >= 0 ? BigDecimal.ZERO : SHIPPING_COST;
        BigDecimal total = subtotal.add(shipping);

        order.setSubtotal(subtotal);
        order.setShipping(shipping);
        order.setTotal(total);

        MarketplaceOrder saved = marketplaceOrderRepository.save(order);
        productRepository.saveAll(products);

        return new ApiDtos.OrderActionResponse(true, "Order created successfully.", ApiMapper.toOrderResponse(saved));
    }

    @Transactional
    public ApiDtos.MessageResponse updateStatus(String orderId, ApiDtos.OrderStatusUpdateRequest request) {
        MarketplaceOrder order = marketplaceOrderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found."));

        order.setStatus(OrderStatus.fromValue(request.status()));
        marketplaceOrderRepository.save(order);
        return new ApiDtos.MessageResponse(true, "Order status updated successfully.");
    }
}
