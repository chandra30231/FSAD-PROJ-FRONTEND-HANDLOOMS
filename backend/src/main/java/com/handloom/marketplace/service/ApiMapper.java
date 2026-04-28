package com.handloom.marketplace.service;

import com.handloom.marketplace.dto.ApiDtos;
import com.handloom.marketplace.model.Campaign;
import com.handloom.marketplace.model.MarketplaceOrder;
import com.handloom.marketplace.model.OrderItem;
import com.handloom.marketplace.model.Product;
import com.handloom.marketplace.model.UserAccount;

import java.util.List;

public final class ApiMapper {

    private ApiMapper() {
    }

    public static ApiDtos.UserResponse toUserResponse(UserAccount user) {
        return new ApiDtos.UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().value(),
                user.getStatus().value(),
                user.isInternalUser() ? "internal" : "registered",
                user.getCreatedAt()
        );
    }

    public static ApiDtos.ProductResponse toProductResponse(Product product) {
        return new ApiDtos.ProductResponse(
                product.getId(),
                product.getName(),
                product.getPrice(),
                product.getRegion(),
                product.getArtisan().getName(),
                product.getArtisan().getId(),
                product.getImage(),
                product.getCategory(),
                product.getDescription(),
                product.getStock(),
                product.getStatus().value()
        );
    }

    public static ApiDtos.OrderItemResponse toOrderItemResponse(OrderItem item) {
        return new ApiDtos.OrderItemResponse(
                item.getId(),
                item.getName(),
                item.getPrice(),
                item.getQuantity(),
                item.getRegion(),
                item.getArtisanName(),
                item.getArtisanId(),
                item.getImage(),
                item.getProductId()
        );
    }

    public static ApiDtos.OrderResponse toOrderResponse(MarketplaceOrder order) {
        List<ApiDtos.OrderItemResponse> items = order.getItems().stream()
                .map(ApiMapper::toOrderItemResponse)
                .toList();

        return new ApiDtos.OrderResponse(
                order.getId(),
                order.getBuyer().getId(),
                order.getBuyerName(),
                order.getCreatedAt(),
                order.getStatus().value(),
                items,
                order.getSubtotal(),
                order.getShipping(),
                order.getTotal()
        );
    }

    public static ApiDtos.CampaignResponse toCampaignResponse(Campaign campaign) {
        return new ApiDtos.CampaignResponse(
                campaign.getId(),
                campaign.getName(),
                campaign.getChannel(),
                campaign.getTargetMarket(),
                campaign.getBudget(),
                campaign.getStatus().value(),
                campaign.getReach(),
                campaign.getConversionRate()
        );
    }
}
