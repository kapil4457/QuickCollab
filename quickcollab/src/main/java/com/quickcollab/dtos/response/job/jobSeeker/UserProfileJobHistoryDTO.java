package com.quickcollab.dtos.response.job.jobSeeker;

import com.quickcollab.dtos.response.user.ReportingUser;
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
public class UserProfileJobHistoryDTO {

    public Long jobId;
    public String title;
    public Date startDate;
    public Date endDate;
    public String location;
    public JobLocationType locationType;
    public ReportingUser reportingUser;
}
