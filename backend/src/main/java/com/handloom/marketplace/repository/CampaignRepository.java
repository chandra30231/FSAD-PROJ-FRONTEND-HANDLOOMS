package com.handloom.marketplace.repository;

import com.handloom.marketplace.model.Campaign;
import com.handloom.marketplace.model.CampaignStatus;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CampaignRepository extends JpaRepository<Campaign, String> {

    List<Campaign> findAll(Sort sort);

    long countByStatus(CampaignStatus status);
}
