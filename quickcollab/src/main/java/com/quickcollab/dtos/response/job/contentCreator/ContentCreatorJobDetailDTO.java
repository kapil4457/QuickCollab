package com.quickcollab.dtos.response.job.contentCreator;

import com.quickcollab.dtos.response.user.ContentCreatorEmployee;
import com.quickcollab.dtos.response.user.UpdatedByUser;
import com.quickcollab.enums.JobLocationType;
import com.quickcollab.enums.JobStatus;
import com.quickcollab.model.User;
import com.quickcollab.pojo.OfferDetail;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ContentCreatorJobDetailDTO {
    private Long jobId;
    private String jobName;
    private String jobDescription;
    private JobStatus jobStatus;
    private Long openingsCount;
    private JobLocationType jobLocationType;
    private List<ContentCreatorEmployee> applicants;
    private List<OfferDetail> offeredTo;
    private String jobLocation;
    private Date postedOn;
    private UpdatedByUser updatedBy;
    private Date updatedOn;
}
