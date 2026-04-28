package com.handloom.marketplace.repository;

import com.handloom.marketplace.model.MarketplaceOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MarketplaceOrderRepository extends JpaRepository<MarketplaceOrder, String> {

    List<MarketplaceOrder> findByBuyer_IdOrderByCreatedAtDesc(String buyerId);

    List<MarketplaceOrder> findAllByOrderByCreatedAtDesc();

    @Query("select distinct o from MarketplaceOrder o join o.items i where i.artisanId = :artisanId order by o.createdAt desc")
    List<MarketplaceOrder> findArtisanOrders(@Param("artisanId") String artisanId);
}
