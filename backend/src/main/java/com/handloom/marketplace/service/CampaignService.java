package com.handloom.marketplace.service;

import com.handloom.marketplace.dto.ApiDtos;
import com.handloom.marketplace.model.Campaign;
import com.handloom.marketplace.model.CampaignStatus;
import com.handloom.marketplace.repository.CampaignRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class CampaignService {

    private final CampaignRepository campaignRepository;
    private final IdGenerationService idGenerationService;

    public CampaignService(CampaignRepository campaignRepository, IdGenerationService idGenerationService) {
        this.campaignRepository = campaignRepository;
        this.idGenerationService = idGenerationService;
    }

    @Transactional(readOnly = true)
    public List<ApiDtos.CampaignResponse> getCampaigns() {
        return campaignRepository.findAll(Sort.by("id"))
                .stream()
                .map(ApiMapper::toCampaignResponse)
                .toList();
    }

    @Transactional
    public ApiDtos.CampaignResponse createCampaign(ApiDtos.CampaignRequest request) {
        Campaign campaign = new Campaign(
                idGenerationService.nextCampaignId(campaignRepository.findAll().stream().map(Campaign::getId).toList()),
                request.name().trim(),
                request.channel().trim(),
                request.targetMarket().trim(),
                request.budget(),
                CampaignStatus.fromValue(request.status()),
                request.reach() == null ? 0L : request.reach(),
                request.conversionRate() == null ? BigDecimal.ZERO : request.conversionRate()
        );

        return ApiMapper.toCampaignResponse(campaignRepository.save(campaign));
    }
}
