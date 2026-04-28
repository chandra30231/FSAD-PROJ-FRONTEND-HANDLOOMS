package com.handloom.marketplace.model;

import java.util.Locale;

public enum UserRole {
    BUYER,
    ARTISAN,
    ADMIN,
    MARKETING;

    public static UserRole fromValue(String value) {
        return UserRole.valueOf(value.trim().toUpperCase(Locale.ROOT));
    }

    public String value() {
        return name().toLowerCase(Locale.ROOT);
    }
}
