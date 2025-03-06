package com.quickcollab.dtos.response.job.jobSeeker;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class JobSeekerJobApplication {
    private Long jobId;
    private String jobName;
    private String jobDescription;
    private String jobStatus;
    private Long openingsCount;
    private String jobLocationType;
    private String jobLocation;
}
