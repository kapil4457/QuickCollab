package com.quickcollab.model;

import com.quickcollab.enums.OfferStatus;
import com.quickcollab.enums.UserRole;
import jakarta.persistence.*;
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
    @Column(length = 2000)
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
