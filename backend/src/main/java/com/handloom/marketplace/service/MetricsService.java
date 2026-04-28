package com.handloom.marketplace.service;

import com.handloom.marketplace.dto.ApiDtos;
import com.handloom.marketplace.model.CampaignStatus;
import com.handloom.marketplace.model.ProductStatus;
import com.handloom.marketplace.model.UserRole;
import com.handloom.marketplace.model.UserStatus;
import com.handloom.marketplace.repository.CampaignRepository;
import com.handloom.marketplace.repository.MarketplaceOrderRepository;
import com.handloom.marketplace.repository.ProductRepository;
import com.handloom.marketplace.repository.UserAccountRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class MetricsService {

    private final UserAccountRepository userAccountRepository;
    private final ProductRepository productRepository;
    private final MarketplaceOrderRepository marketplaceOrderRepository;
    private final CampaignRepository campaignRepository;

    public MetricsService(
            UserAccountRepository userAccountRepository,
            ProductRepository productRepository,
            MarketplaceOrderRepository marketplaceOrderRepository,
            CampaignRepository campaignRepository
    ) {
        this.userAccountRepository = userAccountRepository;
        this.productRepository = productRepository;
        this.marketplaceOrderRepository = marketplaceOrderRepository;
        this.campaignRepository = campaignRepository;
    }

    @Transactional(readOnly = true)
    public ApiDtos.PlatformMetricsResponse getPlatformMetrics() {
        long users = userAccountRepository.count();
        long activeArtisans = userAccountRepository.countByRoleAndStatus(UserRole.ARTISAN, UserStatus.APPROVED);
        long pendingApprovals = userAccountRepository.countByRoleAndStatus(UserRole.ARTISAN, UserStatus.PENDING);
        long products = productRepository.count();
        long orders = marketplaceOrderRepository.count();
        long activeListings = productRepository.countByStatus(ProductStatus.ACTIVE);

        BigDecimal revenue = marketplaceOrderRepository.findAll().stream()
                .map(order -> order.getTotal() == null ? BigDecimal.ZERO : order.getTotal())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new ApiDtos.PlatformMetricsResponse(users, activeArtisans, pendingApprovals, products, orders, activeListings, revenue);
    }

    @Transactional(readOnly = true)
    public ApiDtos.MarketingMetricsResponse getMarketingMetrics() {
        long totalReach = campaignRepository.findAll().stream()
                .mapToLong(campaign -> campaign.getReach() == null ? 0L : campaign.getReach())
                .sum();

        BigDecimal totalSpend = campaignRepository.findAll().stream()
                .map(campaign -> campaign.getBudget() == null ? BigDecimal.ZERO : campaign.getBudget())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal avgConversion = BigDecimal.ZERO;
        long campaignCount = campaignRepository.count();
        if (campaignCount > 0) {
            BigDecimal totalConversion = campaignRepository.findAll().stream()
                    .map(campaign -> campaign.getConversionRate() == null ? BigDecimal.ZERO : campaign.getConversionRate())
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            avgConversion = totalConversion.divide(BigDecimal.valueOf(campaignCount), 2, RoundingMode.HALF_UP);
        }

        long liveCampaigns = campaignRepository.countByStatus(CampaignStatus.ACTIVE);
        long draftCampaigns = campaignRepository.countByStatus(CampaignStatus.DRAFT);
        long catalogSize = productRepository.countByStatus(ProductStatus.ACTIVE);
        long totalOrders = marketplaceOrderRepository.count();

        return new ApiDtos.MarketingMetricsResponse(totalReach, totalSpend, avgConversion, liveCampaigns, draftCampaigns, catalogSize, totalOrders);
    }
}
