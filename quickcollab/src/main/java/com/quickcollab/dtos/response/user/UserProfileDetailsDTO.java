package com.quickcollab.dtos.response.user;
import com.quickcollab.dtos.response.job.jobSeeker.UserProfileJobHistoryDTO;
import com.quickcollab.enums.UserRole;
import com.quickcollab.pojo.JobHistory;
import com.quickcollab.pojo.PersonalProject;
import com.quickcollab.pojo.SocialMediaHandle;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserProfileDetailsDTO {
    private String userId;
    private String firstName;
    private String lastName;
    private String profilePicture;
    private UserRole userRole;
    private String selfDescription;
    private List<SocialMediaHandle> socialMediaHandles;
    private List<PersonalProject> personalProjects;
    private List<UserProfileJobHistoryDTO> jobHistory;
    private Date noticePeriodEndDate;
    private UserProfileJobHistoryDTO currentJobDetails;
    private Long currentJobNoticePeriodDays;
    private ReportingUser reportsTo;
    private Boolean isServingNoticePeriod ;
    private Date currentJobJoinedOn;
}
