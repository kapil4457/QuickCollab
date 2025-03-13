package com.quickcollab.repository;

import com.quickcollab.model.JobOffer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobOfferRepository extends JpaRepository<JobOffer  , String> {
    List<JobOffer> findByUserId(String applicantUserId);
}
