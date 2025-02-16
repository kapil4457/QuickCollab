package com.quickcollab.dtos.response.job.jobSeeker;

import com.quickcollab.enums.JobLocationType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class JobSeekerJobDetailDTO {

    private Long jobId;
    private String jobName;
    private String jobDescription;
    private Long openingsCount;
    private JobLocationType jobLocationType;
    private String jobLocation;
    private JobDetailPostedByUserDTO postedBy;
    private Date postedOn;
}
