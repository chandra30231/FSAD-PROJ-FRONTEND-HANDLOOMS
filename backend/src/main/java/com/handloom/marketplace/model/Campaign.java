package com.handloom.marketplace.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;

@Entity
@Table(name = "campaigns")
public class Campaign {

    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false, length = 180)
    private String name;

    @Column(nullable = false, length = 120)
    private String channel;

    @Column(nullable = false, length = 180)
    private String targetMarket;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal budget;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private CampaignStatus status;

    @Column(nullable = false)
    private Long reach;

    @Column(nullable = false, precision = 6, scale = 2)
    private BigDecimal conversionRate;

    public Campaign() {
    }

    public Campaign(String id, String name, String channel, String targetMarket, BigDecimal budget, CampaignStatus status, Long reach, BigDecimal conversionRate) {
        this.id = id;
        this.name = name;
        this.channel = channel;
        this.targetMarket = targetMarket;
        this.budget = budget;
        this.status = status;
        this.reach = reach;
        this.conversionRate = conversionRate;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getChannel() {
        return channel;
    }

    public void setChannel(String channel) {
        this.channel = channel;
    }

    public String getTargetMarket() {
        return targetMarket;
    }

    public void setTargetMarket(String targetMarket) {
        this.targetMarket = targetMarket;
    }

    public BigDecimal getBudget() {
        return budget;
    }

    public void setBudget(BigDecimal budget) {
        this.budget = budget;
    }

    public CampaignStatus getStatus() {
        return status;
    }

    public void setStatus(CampaignStatus status) {
        this.status = status;
    }

    public Long getReach() {
        return reach;
    }

    public void setReach(Long reach) {
        this.reach = reach;
    }

    public BigDecimal getConversionRate() {
        return conversionRate;
    }

    public void setConversionRate(BigDecimal conversionRate) {
        this.conversionRate = conversionRate;
    }
}
