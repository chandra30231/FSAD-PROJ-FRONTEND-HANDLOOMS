package com.handloom.marketplace.model;

import java.util.Locale;

public enum UserStatus {
    ACTIVE,
    APPROVED,
    PENDING,
    BLOCKED;

    public static UserStatus fromValue(String value) {
        return UserStatus.valueOf(value.trim().toUpperCase(Locale.ROOT));
    }

    public String value() {
        return name().toLowerCase(Locale.ROOT);
    }
}
