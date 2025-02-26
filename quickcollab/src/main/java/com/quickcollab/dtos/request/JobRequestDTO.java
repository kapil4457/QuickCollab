package com.quickcollab.dtos.request;

import com.quickcollab.enums.JobLocationType;
import com.quickcollab.enums.JobStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class JobRequestDTO {
    @NotNull
    private String jobName;
    @NotNull
    private String jobDescription;
    @NotNull
    private JobStatus jobStatus;
    @NotNull
    private Long openingsCount;
    @NotNull
    private JobLocationType jobLocationType;
    @NotNull
    private String jobLocation;
    @NotNull
    private Long noticePeriodDays;
}
