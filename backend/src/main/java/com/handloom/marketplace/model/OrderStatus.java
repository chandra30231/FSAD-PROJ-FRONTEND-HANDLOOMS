package com.handloom.marketplace.model;

import java.util.Locale;

public enum OrderStatus {
    PROCESSING,
    SHIPPED,
    DELIVERED;

    public static OrderStatus fromValue(String value) {
        return OrderStatus.valueOf(value.trim().toUpperCase(Locale.ROOT));
    }

    public String value() {
        return name().toLowerCase(Locale.ROOT);
    }
}
