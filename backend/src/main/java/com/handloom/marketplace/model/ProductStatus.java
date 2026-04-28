package com.handloom.marketplace.model;

import java.util.Locale;

public enum ProductStatus {
    ACTIVE,
    PAUSED;

    public static ProductStatus fromValue(String value) {
        return ProductStatus.valueOf(value.trim().toUpperCase(Locale.ROOT));
    }

    public String value() {
        return name().toLowerCase(Locale.ROOT);
    }
}
