package com.quickcollab.dtos.response.job.jobSeeker;

import com.quickcollab.pojo.PersonalProject;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

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
    private Long noticePeriodDays;
}
