package com.handloom.marketplace.service;

import com.handloom.marketplace.model.*;
import com.handloom.marketplace.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserAccountRepository userAccountRepository;
    private final ProductRepository productRepository;
    private final CampaignRepository campaignRepository;
    private final MarketplaceOrderRepository marketplaceOrderRepository;

    public DataSeeder(
            UserAccountRepository userAccountRepository,
            ProductRepository productRepository,
            CampaignRepository campaignRepository,
            MarketplaceOrderRepository marketplaceOrderRepository
    ) {
        this.userAccountRepository = userAccountRepository;
        this.productRepository = productRepository;
        this.campaignRepository = campaignRepository;
        this.marketplaceOrderRepository = marketplaceOrderRepository;
    }

    @Override
    @Transactional   // ✅ FIX ADDED HERE
    public void run(String... args) {
        seedUsers();
        seedProducts();
        seedCampaigns();
        seedOrders();
    }

    private void seedUsers() {
        if (userAccountRepository.count() > 0) return;

        userAccountRepository.save(new UserAccount("admin-001", "System Admin", "admin@handlooms.com", "admin", UserRole.ADMIN, UserStatus.ACTIVE, Instant.parse("2026-01-01T09:00:00Z"), true));
        userAccountRepository.save(new UserAccount("marketing-001", "Global Campaign Lead", "marketing@handlooms.com", "marketing", UserRole.MARKETING, UserStatus.ACTIVE, Instant.parse("2026-01-02T09:00:00Z"), true));
        userAccountRepository.save(new UserAccount("buyer-seed-001", "Maya Thompson", "buyer@handlooms.com", "buyer", UserRole.BUYER, UserStatus.ACTIVE, Instant.parse("2026-01-15T09:30:00Z"), false));
        userAccountRepository.save(new UserAccount("artisan-seed-001", "Raju Weavers", "raju@handlooms.com", "artisan", UserRole.ARTISAN, UserStatus.APPROVED, Instant.parse("2026-01-12T09:30:00Z"), false));
        userAccountRepository.save(new UserAccount("artisan-seed-002", "Sita Textiles", "sita@handlooms.com", "artisan", UserRole.ARTISAN, UserStatus.APPROVED, Instant.parse("2026-01-20T11:00:00Z"), false));
        userAccountRepository.save(new UserAccount("artisan-seed-003", "Kalamkari Arts", "kalamkari@handlooms.com", "artisan", UserRole.ARTISAN, UserStatus.APPROVED, Instant.parse("2026-01-28T08:15:00Z"), false));
    }

    private void seedProducts() {
        if (productRepository.count() > 0) return;

        UserAccount raju = userAccountRepository.findById("artisan-seed-001").orElseThrow();
        UserAccount sita = userAccountRepository.findById("artisan-seed-002").orElseThrow();
        UserAccount kalamkari = userAccountRepository.findById("artisan-seed-003").orElseThrow();

        productRepository.save(new Product("Ikat Silk Saree", BigDecimal.valueOf(5500), "Telangana", raju, "https://placehold.co/600x450?text=Ikat+Silk+Saree", "Women", "Authentic handwoven Ikat silk saree...", 12, ProductStatus.ACTIVE));
        productRepository.save(new Product("Mangalagiri Cotton Dress", BigDecimal.valueOf(2500), "Andhra Pradesh", sita, "https://placehold.co/600x450?text=Mangalagiri+Cotton", "Fabric", "Soft and breathable cotton...", 9, ProductStatus.ACTIVE));
        productRepository.save(new Product("Kalamkari Dupatta", BigDecimal.valueOf(1200), "Andhra Pradesh", kalamkari, "https://placehold.co/600x450?text=Kalamkari+Dupatta", "Accessories", "Hand-painted dupatta...", 25, ProductStatus.ACTIVE));
        productRepository.save(new Product("Pochampally Mens Kurta", BigDecimal.valueOf(1800), "Telangana", raju, "https://placehold.co/600x450?text=Pochampally+Kurta", "Men", "Handloom cotton kurta...", 18, ProductStatus.ACTIVE));
    }

    private void seedCampaigns() {
        if (campaignRepository.count() > 0) return;

        campaignRepository.save(new Campaign("CMP-001", "Global Heritage Fest", "Social Media", "US and Europe", BigDecimal.valueOf(120000), CampaignStatus.ACTIVE, 124500L, BigDecimal.valueOf(3.1)));
        campaignRepository.save(new Campaign("CMP-002", "Artisan Spotlight: Ikat", "Email", "UK and India", BigDecimal.valueOf(45000), CampaignStatus.DRAFT, 18200L, BigDecimal.valueOf(1.7)));
    }

    private void seedOrders() {
        if (marketplaceOrderRepository.count() > 0) return;

        UserAccount buyer = userAccountRepository.findById("buyer-seed-001").orElseThrow();

        Product mangalagiri = productRepository.findAll().stream()
                .filter(p -> "Mangalagiri Cotton Dress".equals(p.getName()))
                .findFirst().orElseThrow();

        Product ikat = productRepository.findAll().stream()
                .filter(p -> "Ikat Silk Saree".equals(p.getName()))
                .findFirst().orElseThrow();

        MarketplaceOrder orderOne = new MarketplaceOrder(
                "ORD-0001", buyer, buyer.getName(),
                Instant.parse("2026-02-20T10:00:00Z"),
                OrderStatus.DELIVERED,
                BigDecimal.valueOf(2500),
                BigDecimal.valueOf(250),
                BigDecimal.valueOf(2750)
        );

        orderOne.addItem(new OrderItem(
                mangalagiri.getId(),
                mangalagiri.getName(),
                mangalagiri.getPrice(),
                1,
                mangalagiri.getRegion(),
                mangalagiri.getArtisan().getName(), // now safe
                mangalagiri.getArtisan().getId(),
                mangalagiri.getImage()
        ));

        MarketplaceOrder orderTwo = new MarketplaceOrder(
                "ORD-0002", buyer, buyer.getName(),
                Instant.parse("2026-03-02T14:45:00Z"),
                OrderStatus.PROCESSING,
                BigDecimal.valueOf(5500),
                BigDecimal.ZERO,
                BigDecimal.valueOf(5500)
        );

        orderTwo.addItem(new OrderItem(
                ikat.getId(),
                ikat.getName(),
                ikat.getPrice(),
                1,
                ikat.getRegion(),
                ikat.getArtisan().getName(), // now safe
                ikat.getArtisan().getId(),
                ikat.getImage()
        ));

        marketplaceOrderRepository.save(orderOne);
        marketplaceOrderRepository.save(orderTwo);
    }
}