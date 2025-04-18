package com.quickcollab.dtos.response.user;

import com.quickcollab.dtos.request.UploadRequestDTO;
import com.quickcollab.dtos.response.conversation.UserConversationDetail;
import com.quickcollab.dtos.response.job.jobSeeker.JobSeekerJobApplication;
import com.quickcollab.enums.ContentType;
import com.quickcollab.enums.MediaType;
import com.quickcollab.enums.Platform;
import com.quickcollab.enums.UserRole;
import com.quickcollab.model.Conversation;
import com.quickcollab.model.Work;
import com.quickcollab.pojo.OfferDetail;
import com.quickcollab.pojo.PersonalProject;
import com.quickcollab.pojo.SocialMediaHandle;
import com.quickcollab.pojo.JobHistory;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;
import java.util.Map;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TeamMemberUserDetails {
    private String userId;
    private String firstName;
    private String lastName;
    private String emailId;
    private String profilePicture;
    private String selfDescription;
    private List<SocialMediaHandle> socialMediaHandles;
    private List<JobSeekerJobApplication> appliedJobs;
    private List<PersonalProject> personalProjects;
    private List<JobHistory> jobHistory;
    private Date noticePeriodEndDate;
    private JobHistory currentJobDetails;
    private UserRole userRole;
    private Long currentJobNoticePeriodDays;
    private ReportingUser reportsTo;
    private List<OfferDetail> offersReceived;
    private Boolean isServingNoticePeriod ;
    private Date currentJobJoinedOn;
    private Long currentSalary;
    private List<Platform> availablePlatforms;
    private List<UploadTypeMappingItemList> availableContentTypes;
    private List<UploadRequestResponseDTO> uploadRequests;

}
