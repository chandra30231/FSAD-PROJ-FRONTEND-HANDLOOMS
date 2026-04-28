package com.handloom.marketplace.service;

import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.UUID;

@Service
public class IdGenerationService {

    public String newUserId() {
        return "usr-" + UUID.randomUUID().toString().replace("-", "").substring(0, 10);
    }

    public String nextOrderId(Collection<String> existingIds) {
        return nextPrefixedId(existingIds, "ORD-", 4);
    }

    public String nextCampaignId(Collection<String> existingIds) {
        return nextPrefixedId(existingIds, "CMP-", 3);
    }

    private String nextPrefixedId(Collection<String> existingIds, String prefix, int width) {
        int next = existingIds.stream()
                .filter(id -> id != null && id.startsWith(prefix))
                .map(id -> id.substring(prefix.length()))
                .mapToInt(value -> {
                    try {
                        return Integer.parseInt(value);
                    } catch (NumberFormatException exception) {
                        return 0;
                    }
                })
                .max()
                .orElse(0) + 1;

        return prefix + String.format("%0" + width + "d", next);
    }
}
