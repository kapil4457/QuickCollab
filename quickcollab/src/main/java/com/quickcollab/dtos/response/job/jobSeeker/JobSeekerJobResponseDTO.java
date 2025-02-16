package com.quickcollab.dtos.response.job.jobSeeker;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class JobSeekerJobResponseDTO {
    private List<JobSeekerJobDetailDTO> jobs;
    private String message;
    private Boolean success;
}

