package com.handloom.marketplace.controller;

import com.handloom.marketplace.dto.ApiDtos;
import com.handloom.marketplace.service.MetricsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/metrics")
public class MetricsController {

    private final MetricsService metricsService;

    public MetricsController(MetricsService metricsService) {
        this.metricsService = metricsService;
    }

    @GetMapping("/platform")
    public ApiDtos.PlatformMetricsResponse getPlatformMetrics() {
        return metricsService.getPlatformMetrics();
    }

    @GetMapping("/marketing")
    public ApiDtos.MarketingMetricsResponse getMarketingMetrics() {
        return metricsService.getMarketingMetrics();
    }
}
