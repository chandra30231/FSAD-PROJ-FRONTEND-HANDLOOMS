package com.handloom.marketplace.model;

import java.util.Locale;

public enum CampaignStatus {
    DRAFT,
    ACTIVE;

    public static CampaignStatus fromValue(String value) {
        return CampaignStatus.valueOf(value.trim().toUpperCase(Locale.ROOT));
    }

    public String value() {
        return name().toLowerCase(Locale.ROOT);
    }
}
