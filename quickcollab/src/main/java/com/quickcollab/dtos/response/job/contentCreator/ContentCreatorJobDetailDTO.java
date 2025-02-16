package com.quickcollab.dtos.response.job.contentCreator;

import com.quickcollab.enums.JobLocationType;
import com.quickcollab.enums.JobStatus;
import com.quickcollab.model.User;
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
    private List<User> applicants;
    private String jobLocation;
    private Date postedOn;
}
