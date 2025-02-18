package com.quickcollab.dtos.request;

import com.quickcollab.enums.JobLocationType;
import com.quickcollab.enums.JobStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class JobRequestDTO {
    private String jobName;
    private String jobDescription;
    private JobStatus jobStatus;
    private Long openingsCount;
    private JobLocationType jobLocationType;
    private String jobLocation;
}
