package com.quickcollab.model;

import com.quickcollab.enums.OfferStatus;
import com.quickcollab.enums.UserRole;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class JobOffer {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String offerId;
    @NotNull
    public String userId;
    @NotNull
    public Long jobId;
    @NotNull
    public String jobTitle;
    @NotNull
    public Long salary;
    @NotNull
    public UserRole userRole;
    @NotNull
    public Date offeredOn;
    @NotNull
    public Date validTill;
    @NotNull
    public OfferStatus offerStatus;
}
