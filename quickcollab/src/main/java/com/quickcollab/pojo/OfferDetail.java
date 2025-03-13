package com.quickcollab.pojo;

import com.quickcollab.enums.OfferStatus;
import com.quickcollab.enums.UserRole;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OfferDetail {
    public String offerId;
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
