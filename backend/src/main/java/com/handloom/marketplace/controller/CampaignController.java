package com.handloom.marketplace.controller;

import com.handloom.marketplace.dto.ApiDtos;
import com.handloom.marketplace.service.CampaignService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/campaigns")
public class CampaignController {

    private final CampaignService campaignService;

    public CampaignController(CampaignService campaignService) {
        this.campaignService = campaignService;
    }

    @GetMapping
    public List<ApiDtos.CampaignResponse> getCampaigns() {
        return campaignService.getCampaigns();
    }

    @PostMapping
    public ApiDtos.CampaignResponse createCampaign(@Valid @RequestBody ApiDtos.CampaignRequest request) {
        return campaignService.createCampaign(request);
    }
}
