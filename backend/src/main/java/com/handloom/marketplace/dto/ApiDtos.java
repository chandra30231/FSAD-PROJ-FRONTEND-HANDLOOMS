package com.handloom.marketplace.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public final class ApiDtos {

    private ApiDtos() {
    }

    public record LoginRequest(
            @NotBlank String email,
            @NotBlank String password
    ) {
    }

    public record RegisterRequest(
            @NotBlank String name,
            @Email @NotBlank String email,
            @NotBlank String password,
            @NotBlank String role
    ) {
    }

    public record UserResponse(
            String id,
            String name,
            String email,
            String role,
            String status,
            String source,
            Instant createdAt
    ) {
    }

    public record AuthResponse(
            boolean ok,
            String message,
            UserResponse user
    ) {
    }

    public record RegisterResponse(
            boolean ok,
            String message,
            UserResponse user
    ) {
    }

    public record StatusUpdateRequest(
            @NotBlank String status
    ) {
    }

    public record MessageResponse(
            boolean ok,
            String message
    ) {
    }

    public record ProductRequest(
            @NotBlank String name,
            @NotNull @DecimalMin("0.0") BigDecimal price,
            @NotBlank String region,
            String image,
            @NotBlank String category,
            @NotBlank String description,
            @NotNull @Min(0) Integer stock,
            @NotBlank String status
    ) {
    }

    public record ProductResponse(
            Long id,
            String name,
            BigDecimal price,
            String region,
            String artisan,
            String artisanId,
            String image,
            String category,
            String description,
            Integer stock,
            String status
    ) {
    }

    public record CheckoutItemRequest(
            @NotNull Long productId,
            @NotNull @Min(1) Integer quantity
    ) {
    }

    public record CheckoutRequest(
            @NotBlank String buyerId,
            @Valid @NotEmpty List<CheckoutItemRequest> items
    ) {
    }

    public record OrderItemResponse(
            Long id,
            String name,
            BigDecimal price,
            Integer quantity,
            String region,
            String artisan,
            String artisanId,
            String image,
            Long productId
    ) {
    }

    public record OrderResponse(
            String id,
            String buyerId,
            String buyerName,
            Instant date,
            String status,
            List<OrderItemResponse> items,
            BigDecimal subtotal,
            BigDecimal shipping,
            BigDecimal total
    ) {
    }

    public record OrderActionResponse(
            boolean ok,
            String message,
            OrderResponse order
    ) {
    }

    public record OrderStatusUpdateRequest(
            @NotBlank String status
    ) {
    }

    public record CampaignRequest(
            @NotBlank String name,
            @NotBlank String channel,
            @NotBlank String targetMarket,
            @NotNull @DecimalMin("0.0") BigDecimal budget,
            @NotBlank String status,
            Long reach,
            BigDecimal conversionRate
    ) {
    }

    public record CampaignResponse(
            String id,
            String name,
            String channel,
            String targetMarket,
            BigDecimal budget,
            String status,
            Long reach,
            BigDecimal conversionRate
    ) {
    }

    public record PlatformMetricsResponse(
            long users,
            long activeArtisans,
            long pendingApprovals,
            long products,
            long orders,
            long activeListings,
            BigDecimal revenue
    ) {
    }

    public record MarketingMetricsResponse(
            long totalReach,
            BigDecimal totalSpend,
            BigDecimal avgConversion,
            long liveCampaigns,
            long draftCampaigns,
            long catalogSize,
            long totalOrders
    ) {
    }
}
