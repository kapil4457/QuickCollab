package com.quickcollab.dtos.response.user;

import com.quickcollab.enums.UserRole;
import com.quickcollab.model.Work;
import com.quickcollab.pojo.JobHistory;
import com.quickcollab.pojo.SocialMediaHandle;
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
public class ContentCreatorEmployee {
    private String userId;
    private String firstName;
    private String lastName;
    private String emailId;
    private String profilePicture;
    private String selfDescription;
    private List<SocialMediaHandle> socialMediaHandles;
    private List<Work> works;
    private List<JobHistory> jobHistory;
    private UserRole userRole;
    private Long currentSalary;
    private Boolean isServingNoticePeriod;
    private Date noticePeriodEndDate;
}
