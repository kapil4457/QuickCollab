package com.quickcollab.dtos.response.user;

import com.quickcollab.enums.UserRole;
import com.quickcollab.model.Conversation;
import com.quickcollab.model.Job;
import com.quickcollab.model.Work;
import com.quickcollab.pojo.OfferDetail;
import com.quickcollab.pojo.SocialMediaHandle;
import com.quickcollab.pojo.WorkHistory;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;


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
    private List<Conversation> conversations;
    private List<SocialMediaHandle> socialMediaHandles;
    private List<Job> appliedJobs;
    private List<Work> works;
    private List<WorkHistory> workHistory;
    private UserRole userRole;
    private ReportingUser reportsTo;
    private List<OfferDetail> offersReceived;

}
